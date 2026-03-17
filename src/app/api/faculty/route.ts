import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Faculty } from '@/models';

// Helper function to trigger real-time updates
function triggerRealtimeUpdate(type: string, data: any) {
  const connections = (global as any).sseConnections || new Set();
  const message = `data: ${JSON.stringify({ 
    type, 
    data, 
    timestamp: Date.now() 
  })}\n\n`;
  
  connections.forEach((controller: any) => {
    try {
      controller.enqueue(message);
    } catch (error) {
      connections.delete(controller);
    }
  });
}

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

// POST - Add new faculty member
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'qualification', 'experience', 'subjects', 'designation'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new faculty member
    const newFaculty = new Faculty({
      ...body,
      isActive: true,
      joiningDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newFaculty.save();
    console.log(`✅ Added new faculty member: ${newFaculty.name}`);

    // Trigger real-time updates
    const allFaculty = await Faculty.find({ isActive: true }).sort({ joiningDate: -1 });
    triggerRealtimeUpdate('faculty_update', { faculty: allFaculty });

    return NextResponse.json({
      success: true,
      message: 'Faculty member added successfully',
      data: newFaculty
    });

  } catch (error) {
    console.error('❌ Error adding faculty:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add faculty member' },
      { status: 500 }
    );
  }
}
