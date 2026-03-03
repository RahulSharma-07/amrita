import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Faculty } from '@/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const designation = searchParams.get('designation');
    
    const query: Record<string, unknown> = { isActive: true };
    
    if (subject) {
      query.subjects = { $in: [subject] };
    }
    
    if (designation) {
      query.designation = designation;
    }
    
    const faculty = await Faculty.find(query)
      .sort({ joiningDate: -1 })
      .select('-__v');
    
    return NextResponse.json({ faculty });
    
  } catch (error) {
    console.error('Get faculty error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
