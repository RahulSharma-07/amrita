import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Gallery } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    const query: Record<string, unknown> = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const [albums, total] = await Promise.all([
      Gallery.find(query)
        .sort({ eventDate: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Gallery.countDocuments(query),
    ]);
    
    return NextResponse.json({
      albums,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
