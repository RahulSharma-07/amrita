import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Tour } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const upcoming = searchParams.get('upcoming') === 'true';
    
    const query: Record<string, unknown> = { isActive: true };
    
    if (upcoming) {
      query.startDate = { $gte: new Date() };
    }
    
    const skip = (page - 1) * limit;
    
    const [tours, total] = await Promise.all([
      Tour.find(query)
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .populate('createdBy', 'name'),
      Tour.countDocuments(query),
    ]);
    
    return NextResponse.json({
      tours,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Get tours error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
