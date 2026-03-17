import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory rate limiting (per instance)
const rateLimitMap = new Map();

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 60; // 60 requests per minute

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const rateData = rateLimitMap.get(ip);
    if (now > rateData.resetTime) {
      rateData.count = 1;
      rateData.resetTime = now + windowMs;
    } else {
      rateData.count++;
      if (rateData.count > maxRequests) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    }
  }

  // Security check for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token');
    if (!token && !request.nextUrl.pathname.includes('/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
