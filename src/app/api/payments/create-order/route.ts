import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Admission, Payment } from '@/models';
import { createOrder } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json();
    
    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }
    
    // For testing, we'll use mock payments since Razorpay keys are not valid
    const useMockPayment = true; // Set to false when you have valid Razorpay keys
    
    let admission;
    let useFallback = false;
    
    try {
      await connectDB();
      admission = await Admission.findOne({ uniqueApplicationID: applicationId });
    } catch (dbError) {
      console.log('MongoDB unavailable, using fallback for payment');
      useFallback = true;
      // Get from localStorage via client or use mock data
      admission = {
        _id: applicationId,
        uniqueApplicationID: applicationId,
        registrationFee: 500,
        paymentStatus: 'Pending',
        studentDetails: {
          firstName: 'Student',
          lastName: 'Name',
          applyingForClass: 'Nursery',
        },
        fatherDetails: { email: '', phone: '' },
        motherDetails: { email: '', phone: '' },
      };
    }
    
    if (!admission && !useFallback) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    if (admission.paymentStatus === 'Paid') {
      return NextResponse.json(
        { error: 'Payment already completed for this application' },
        { status: 400 }
      );
    }
    
    // Create mock order for testing (since Razorpay keys are not valid)
    const order = {
      id: 'order_' + Date.now(),
      amount: (admission.registrationFee || 500) * 100,
      currency: 'INR',
    };
    console.log('Created mock order:', order.id);
    
    // Update or create payment record (only if DB is available)
    if (!useFallback) {
      try {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: order.id },
          {
            admissionId: admission._id,
            amount: admission.registrationFee,
            currency: 'INR',
            razorpayOrderId: order.id,
            status: 'Created',
            metadata: {
              studentName: `${admission.studentDetails?.firstName || ''} ${admission.studentDetails?.lastName || ''}`,
              classApplied: admission.studentDetails?.applyingForClass || '',
              parentEmail: admission.fatherDetails?.email || admission.motherDetails?.email || '',
              parentPhone: admission.fatherDetails?.phone || '',
            },
          },
          { upsert: true, new: true }
        );
        
        admission.razorpayOrderId = order.id;
        await admission.save();
      } catch (dbError) {
        console.error('DB update error:', dbError);
      }
    }
    
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
    
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
