// Server-side function to trigger real-time updates
export async function triggerRealtimeUpdate(type: string, data: any) {
  try {
    // Call the broadcast function from the API route
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/realtime/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger real-time update');
    }

    console.log(`✅ Real-time update triggered: ${type}`, data);
    return true;
  } catch (error) {
    console.error('❌ Error triggering real-time update:', error);
    return false;
  }
}

// Specific update functions for common admin actions
export const realtimeActions = {
  sliderUpdated: (slides: any[]) => 
    triggerRealtimeUpdate('slider_update', { slides }),

  facultyUpdated: (faculty: any[]) => 
    triggerRealtimeUpdate('faculty_update', { faculty }),

  galleryUpdated: (images: any[]) => 
    triggerRealtimeUpdate('gallery_update', { images }),

  noticeUpdated: (notices: any[]) => 
    triggerRealtimeUpdate('notice_update', { notices }),

  contentUpdated: (page: string, content: any) => 
    triggerRealtimeUpdate('content_update', { page, content }),

  admissionUpdated: (data: any) => 
    triggerRealtimeUpdate('admission_update', { data }),

  settingsUpdated: (settings: any) => 
    triggerRealtimeUpdate('settings_update', { settings }),
};
