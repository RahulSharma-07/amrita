import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';
import { authenticateRequest } from '@/lib/auth';

// Fallback admin for when MongoDB is unavailable
const fallbackAdmin = {
  _id: 'admin-fallback-id',
  name: 'Administrator',
  email: 'amritaacademy@yahoo.co.in',
  role: 'Admin',
  permissions: [
    'view_dashboard', 'view_admissions', 'manage_admissions', 'approve_admissions',
    'view_students', 'manage_students', 'view_faculty', 'manage_faculty',
    'view_fees', 'manage_fees', 'view_gallery', 'manage_gallery',
    'view_calendar', 'manage_calendar', 'view_documents', 'manage_documents',
    'view_tours', 'manage_tours', 'view_notices', 'manage_notices',
    'manage_slider', 'view_settings', 'manage_settings',
    'view_users', 'manage_users', 'manage_roles',
  ],
  isActive: true,
};

export async function GET(req: NextRequest) {
  try {
    const payload = await authenticateRequest(req);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    let user;
    
    try {
      await connectDB();
      user = await User.findById(payload.userId).select('-password');
    } catch (dbError) {
      console.log('MongoDB unavailable, using fallback for /me');
    }
    
    // Use fallback if DB failed or user not found
    if (!user) {
      if (payload.email === fallbackAdmin.email) {
        user = fallbackAdmin;
      } else {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
