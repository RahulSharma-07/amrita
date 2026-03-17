import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';
import { generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

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
      console.error('MongoDB error during login:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
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
