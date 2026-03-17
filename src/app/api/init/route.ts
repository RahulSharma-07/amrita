import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';

export async function GET() {
  try {
    await connectDB();
    
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('80530', 10);
    
    // Check if admin already exists
    let admin = await User.findOne({ email: 'amritaacademy@yahoo.co.in' });
    
    if (admin) {
      // Update existing admin password to ensure it's hashed
      admin.password = hashedPassword;
      await admin.save();
      return NextResponse.json({ 
        message: 'Admin password updated and hashed',
        initialized: true 
      });
    }
    
    // Create admin user
    admin = new User({
      name: 'Administrator',
      email: 'amritaacademy@yahoo.co.in',
      password: hashedPassword,
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
    });
    
    await admin.save();
    
    return NextResponse.json({ 
      message: 'Admin user created successfully',
      initialized: true,
      credentials: {
        email: 'amritaacademy@yahoo.co.in',
        password: '80530'
      }
    });
    
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize', initialized: false },
      { status: 500 }
    );
  }
}
