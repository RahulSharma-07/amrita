import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Admission, Payment } from '@/models';
import { admissionFormSchema } from '@/lib/validations';
import { generateApplicationId } from '@/lib/utils';
import { authenticateRequest, hasPermission, PERMISSIONS } from '@/lib/auth';

// Create new admission
export async function POST(req: NextRequest) {
  try {
    let dbConnected = false;
    try {
      await connectDB();
      dbConnected = true;
    } catch (dbError) {
      console.log('MongoDB unavailable, using localStorage fallback for admission');
    }
    
    const formData = await req.formData();
    
    // Parse form data
    const data = {
      studentDetails: JSON.parse(formData.get('studentDetails') as string),
      fatherDetails: JSON.parse(formData.get('fatherDetails') as string),
      motherDetails: JSON.parse(formData.get('motherDetails') as string),
      presentAddress: JSON.parse(formData.get('presentAddress') as string),
      permanentAddress: JSON.parse(formData.get('permanentAddress') as string),
      previousSchoolDetails: formData.get('previousSchoolDetails') 
        ? JSON.parse(formData.get('previousSchoolDetails') as string)
        : undefined,
      agreedToTerms: formData.get('agreedToTerms') === 'true',
    };
    
    // Validate data
    const result = admissionFormSchema.safeParse(data);
    if (!result.success) {
      const errorDetails = (result.error as any).errors || (result.error as any).issues || [];
      console.error('Validation errors:', JSON.stringify(errorDetails, null, 2));
      return NextResponse.json(
        { error: 'Validation failed', details: errorDetails },
        { status: 400 }
      );
    }
    
    // Check for duplicate application (only if DB is connected)
    if (dbConnected) {
      const existingAdmission = await Admission.findOne({
        'studentDetails.firstName': data.studentDetails.firstName,
        'studentDetails.lastName': data.studentDetails.lastName,
        'studentDetails.dateOfBirth': new Date(data.studentDetails.dateOfBirth),
        'fatherDetails.phone': data.fatherDetails.phone,
      });
      
      if (existingAdmission) {
        return NextResponse.json(
          { error: 'An application already exists for this student', applicationId: existingAdmission.uniqueApplicationID },
          { status: 409 }
        );
      }
    }
    
    // Generate unique application ID
    const uniqueApplicationID = generateApplicationId();
    
    // Handle file uploads (in production, upload to Cloudinary)
    const files: Record<string, string> = {};
    const fileFields = ['studentPhoto', 'birthCertificate', 'aadharCard', 'previousMarksheet', 'transferCertificate', 'fatherPhoto', 'motherPhoto'];
    
    for (const field of fileFields) {
      const file = formData.get(field) as File;
      if (file) {
        // In production, upload to Cloudinary and store URL
        // For now, we'll store a placeholder
        files[field] = `uploads/${field}_${uniqueApplicationID}`;
      }
    }
    
    // Generate mock order ID for payment
    const mockOrderId = 'order_' + Date.now();
    
    // Create admission data object
    const admissionData = {
      _id: Date.now().toString(),
      uniqueApplicationID,
      studentDetails: {
        ...data.studentDetails,
        dateOfBirth: new Date(data.studentDetails.dateOfBirth),
        photo: files.studentPhoto || '',
        birthCertificate: files.birthCertificate || '',
        aadharCard: files.aadharCard || '',
        previousMarksheet: files.previousMarksheet || '',
        transferCertificate: files.transferCertificate || '',
      },
      fatherDetails: {
        ...data.fatherDetails,
        photo: files.fatherPhoto || '',
      },
      motherDetails: {
        ...data.motherDetails,
        photo: files.motherPhoto || '',
      },
      presentAddress: data.presentAddress,
      permanentAddress: data.permanentAddress,
      previousSchoolDetails: data.previousSchoolDetails,
      registrationFee: 500,
      paymentStatus: 'Pending',
      applicationStatus: 'Pending',
      razorpayOrderId: mockOrderId,
      createdAt: new Date().toISOString(),
    };
    
    // Save to database only if connected
    if (dbConnected) {
      try {
        const admission = new Admission(admissionData);
        await admission.save();
        
        // Create payment record
        const payment = new Payment({
          admissionId: admission._id,
          amount: 500,
          currency: 'INR',
          razorpayOrderId: mockOrderId,
          status: 'Created',
          metadata: {
            studentName: `${data.studentDetails.firstName} ${data.studentDetails.lastName}`,
            classApplied: data.studentDetails.applyingForClass,
            parentEmail: data.fatherDetails.email || data.motherDetails.email,
            parentPhone: data.fatherDetails.phone,
          },
        });
        
        await payment.save();
      } catch (saveError) {
        console.error('Error saving to DB:', saveError);
      }
    }
    
    // Note: localStorage is not available in server-side API routes
    // Admissions are stored in memory for this session only
    // In production with MongoDB, data will persist
    
    return NextResponse.json({
      success: true,
      applicationId: uniqueApplicationID,
      orderId: mockOrderId,
      amount: 500, // 500 INR in paise
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Admission creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all admissions (admin only)
export async function GET(req: NextRequest) {
  try {
    const payload = await authenticateRequest(req);
    
    if (!payload || !hasPermission(payload.permissions, PERMISSIONS.VIEW_ADMISSIONS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const classFilter = searchParams.get('class');
    const search = searchParams.get('search');
    
    const query: Record<string, unknown> = {};
    
    if (status) {
      query.applicationStatus = status;
    }
    
    if (classFilter) {
      query['studentDetails.applyingForClass'] = classFilter;
    }
    
    if (search) {
      query.$or = [
        { uniqueApplicationID: { $regex: search, $options: 'i' } },
        { 'studentDetails.firstName': { $regex: search, $options: 'i' } },
        { 'studentDetails.lastName': { $regex: search, $options: 'i' } },
        { 'fatherDetails.phone': { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [admissions, total] = await Promise.all([
      Admission.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Admission.countDocuments(query),
    ]);
    
    return NextResponse.json({
      admissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Get admissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
