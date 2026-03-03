import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Notice } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const pinnedOnly = searchParams.get('pinned') === 'true';
    
    const now = new Date();
    
    const query: Record<string, unknown> = {
      isPublished: true,
      publishDate: { $lte: now },
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: now } },
      ],
    };
    
    if (category) {
      query.category = category;
    }
    
    if (pinnedOnly) {
      query.isPinned = true;
    }
    
    const notices = await Notice.find(query)
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit)
      .select('-__v')
      .populate('createdBy', 'name');
    
    return NextResponse.json({ notices });
    
  } catch (error) {
    console.error('Get notices error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
