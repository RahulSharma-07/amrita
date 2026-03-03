import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { HeroSlider } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const now = new Date();
    
    const slides = await HeroSlider.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } },
          ],
        },
      ],
    })
      .sort({ displayOrder: 1 })
      .select('-__v -publicId');
    
    return NextResponse.json({ slides });
    
  } catch (error) {
    console.error('Get slider error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
