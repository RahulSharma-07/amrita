import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Admission } from '@/models';
import { authenticateRequest, hasPermission, PERMISSIONS } from '@/lib/auth';

// Get single admission
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateRequest(req);
    
    if (!payload || !hasPermission(payload.permissions, PERMISSIONS.VIEW_ADMISSIONS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const { id } = await params;
    
    const admission = await Admission.findOne({
      $or: [
        { _id: id },
        { uniqueApplicationID: id },
      ],
    });
    
    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ admission });
    
  } catch (error) {
    console.error('Get admission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update admission status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateRequest(req);
    
    if (!payload || !hasPermission(payload.permissions, PERMISSIONS.MANAGE_ADMISSIONS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    const admission = await Admission.findById(id);
    
    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }
    
    // Update fields
    if (body.applicationStatus) {
      admission.applicationStatus = body.applicationStatus;
    }
    
    if (body.adminRemarks) {
      admission.adminRemarks = body.adminRemarks;
    }
    
    await admission.save();
    
    return NextResponse.json({
      success: true,
      admission,
    });
    
  } catch (error) {
    console.error('Update admission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete admission
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticateRequest(req);
    
    if (!payload || !hasPermission(payload.permissions, PERMISSIONS.MANAGE_ADMISSIONS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const { id } = await params;
    
    const admission = await Admission.findByIdAndDelete(id);
    
    if (!admission) {
      return NextResponse.json(
        { error: 'Admission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admission deleted successfully',
    });
    
  } catch (error) {
    console.error('Delete admission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
