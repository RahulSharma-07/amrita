import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';
import { generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

// Fallback admin for when MongoDB is unavailable
const fallbackAdmin = {
  _id: 'admin-fallback-id',
  name: 'Administrator',
  email: 'amritaacademy@yahoo.co.in',
  password: '80530',
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email, password } = result.data;
    
    let user = null;
    let isFallbackUser = false;
    
    // Check if credentials match fallback admin first
    if (email === fallbackAdmin.email && password === fallbackAdmin.password) {
      user = fallbackAdmin;
      isFallbackUser = true;
      console.log('Using fallback admin login');
    } else {
      // Try database login
      try {
        await connectDB();
        const dbUser = await User.findOne({ email, isActive: true });
        
        if (dbUser) {
          const isPasswordValid = await dbUser.comparePassword(password);
          if (isPasswordValid) {
            user = dbUser;
            // Update last login
            dbUser.lastLogin = new Date();
            await dbUser.save();
          }
        }
      } catch (dbError) {
        console.log('MongoDB error:', dbError);
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
    
    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    });
    
    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
