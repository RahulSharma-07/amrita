import { NextRequest, NextResponse } from 'next/server';

// Import the broadcast function (we'll need to refactor this)
async function broadcastUpdate(type: string, data: any) {
  const connections = (global as any).sseConnections || new Set();
  const message = `data: ${JSON.stringify({ type, data, timestamp: Date.now() })}\n\n`;
  
  connections.forEach((controller: any) => {
    try {
      controller.enqueue(message);
    } catch (error) {
      // Remove dead connections
      connections.delete(controller);
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data in request body' },
        { status: 400 }
      );
    }

    // Broadcast the update to all connected clients
    await broadcastUpdate(type, data);

    return NextResponse.json({ 
      success: true, 
      message: `Update broadcasted: ${type}`,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('❌ Error in broadcast API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
