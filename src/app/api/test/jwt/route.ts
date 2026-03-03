import { NextResponse } from 'next/server';
import { generateToken, verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    // Check if JWT_SECRET is loaded
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret || jwtSecret === 'ynskR1eIgX3Rudh4cABZ1DZLRjKgL2Bw879nzTiFCMpB5NWCl2WVbAf0O3BvzIh7XJwDVe6xlVJuDEZt6NAZoPI') {
      return NextResponse.json({
        status: 'ERROR',
        message: 'JWT_SECRET not properly configured',
        secretLoaded: !!jwtSecret,
        secretValue: jwtSecret ? `${jwtSecret.substring(0, 10)}...` : 'not set'
      }, { status: 500 });
    }
    
    // Test token generation
    const testPayload = {
      userId: 'test-user-id',
      email: 'test@example.com',
      role: 'Admin',
      permissions: ['view_dashboard']
    };
    
    const token = generateToken(testPayload);
    
    // Test token verification
    const verified = verifyToken(token);
    
    if (!verified) {
      return NextResponse.json({
        status: 'ERROR',
        message: 'Token verification failed',
        tokenGenerated: !!token
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'OK',
      message: 'JWT is working correctly',
      secretLoaded: true,
      secretLength: jwtSecret.length,
      tokenGenerated: true,
      tokenVerified: true,
      decodedPayload: verified
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'JWT test failed',
      error: String(error)
    }, { status: 500 });
  }
}
