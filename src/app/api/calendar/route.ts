import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Event } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const eventType = searchParams.get('type');
    
    const query: Record<string, unknown> = {
      isPublic: true,
    };
    
    if (eventType) {
      query.eventType = eventType;
    }
    
    if (month && year) {
      const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endOfMonth = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      
      query.startDate = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }
    
    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .select('-__v')
      .populate('createdBy', 'name');
    
    return NextResponse.json({ events });
    
  } catch (error) {
    console.error('Get calendar error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
