import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import connectDB from '@/lib/db';
import { Admission } from '@/models';
import { admissionFormSchema } from '@/lib/validations';
import { generateApplicationId } from '@/lib/utils';
import { authenticateRequest, hasPermission, PERMISSIONS } from '@/lib/auth';

// Create new admission
export async function POST(req: NextRequest) {
  try {
    // Ensure DB is connected
    try {
      await connectDB();
    } catch (dbError: any) {
      console.error('Database connection failed during admission submission:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 503 }
      );
    }
    const dbConnected = true;

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

    // Handle file uploads
    const files: Record<string, string> = {};
    const fileFields = ['studentPhoto', 'birthCertificate', 'aadharCard', 'previousMarksheet', 'transferCertificate', 'fatherPhoto', 'motherPhoto'];

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload dir', err);
    }

    for (const field of fileFields) {
      const file = formData.get(field) as File;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${uniqueApplicationID}_${field}_${Date.now()}.${fileExt}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        files[field] = `/uploads/${fileName}`;
      }
    }

    // Create admission data object
    const admissionData = {
      uniqueApplicationID,
      studentDetails: {
        ...result.data.studentDetails,
        dateOfBirth: new Date(result.data.studentDetails.dateOfBirth),
        academicYear: result.data.studentDetails.academicYear || '2026-2027',
        photo: files.studentPhoto || '',
        birthCertificate: files.birthCertificate || '',
        aadharCard: files.aadharCard || '',
        previousMarksheet: files.previousMarksheet || '',
        transferCertificate: files.transferCertificate || '',
      },
      fatherDetails: {
        ...result.data.fatherDetails,
        profession: (result.data.fatherDetails as any).occupation || 'N/A',
        qualification: result.data.fatherDetails.qualification || 'N/A',
        photo: files.fatherPhoto || '',
      },
      motherDetails: {
        ...result.data.motherDetails,
        profession: (result.data.motherDetails as any).occupation || 'N/A',
        qualification: result.data.motherDetails.qualification || 'N/A',
        photo: files.motherPhoto || '',
      },
      presentAddress: result.data.presentAddress,
      permanentAddress: result.data.permanentAddress,
      previousSchoolDetails: result.data.previousSchoolDetails,
      registrationFee: 0,
      paymentStatus: 'Paid',
      applicationStatus: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Save to database only if connected
    if (dbConnected) {
      try {
        const admission = new Admission(admissionData);
        await admission.save();
      } catch (saveError: any) {
        console.error('Error saving to DB:', saveError);
        return NextResponse.json(
          { error: 'Database save failed', details: saveError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      applicationId: uniqueApplicationID,
      message: 'Admission form submitted successfully',
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
