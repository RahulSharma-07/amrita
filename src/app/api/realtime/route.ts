import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Enable SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue('data: {"type": "connected", "message": "Real-time updates enabled"}\n\n');

      // Store the controller for later use
      (global as any).sseConnections = (global as any).sseConnections || new Set();
      (global as any).sseConnections.add(controller);

      // Clean up on disconnect
      request.signal.addEventListener('abort', () => {
        (global as any).sseConnections.delete(controller);
        controller.close();
      });
    },
  });

  return new Response(stream, { headers });
}

// Function to broadcast updates to all connected clients
export function broadcastUpdate(type: string, data: any) {
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
