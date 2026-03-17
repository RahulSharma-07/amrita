import { useEffect, useState, useCallback } from 'react';

interface RealtimeUpdate {
  type: string;
  data: any;
  timestamp: number;
}

export function useRealtimeUpdates() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<RealtimeUpdate | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource('/api/realtime');

        eventSource.onopen = () => {
          console.log('🔗 Real-time updates connected');
          setIsConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const update: RealtimeUpdate = JSON.parse(event.data);
            console.log('📡 Real-time update received:', update);
            setLastUpdate(update);

            // Trigger page-specific updates based on type
            handleUpdateType(update);
          } catch (error) {
            console.error('❌ Error parsing real-time update:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('❌ Real-time updates error:', error);
          setIsConnected(false);
          
          // Attempt to reconnect after 3 seconds
          setTimeout(() => {
            if (eventSource?.readyState === EventSource.CLOSED) {
              connect();
            }
          }, 3000);
        };

      } catch (error) {
        console.error('❌ Failed to connect to real-time updates:', error);
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
    };
  }, []);

  const handleUpdateType = useCallback((update: RealtimeUpdate) => {
    const { type, data } = update;

    switch (type) {
      case 'slider_update':
        // Refresh slider data
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sliderUpdated', { detail: data }));
        }
        break;

      case 'faculty_update':
        // Refresh faculty data
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('facultyUpdated', { detail: data }));
        }
        break;

      case 'gallery_update':
        // Refresh gallery data
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('galleryUpdated', { detail: data }));
        }
        break;

      case 'notice_update':
        // Refresh notices
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('noticeUpdated', { detail: data }));
        }
        break;

      case 'content_update':
        // General content update - trigger page refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('contentUpdated', { detail: data }));
        }
        break;

      default:
        console.log('📢 Unknown update type:', type);
    }
  }, []);

  const triggerRefresh = useCallback(() => {
    // Force a soft refresh of current page content
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  return {
    isConnected,
    lastUpdate,
    triggerRefresh,
  };
}
