import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPresence {
  user_id: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
}

export const useUserPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updatePresence = async (status: 'online' | 'offline' | 'away' = 'online', currentPage?: string) => {
    if (!user) return;

    try {
      await supabase.from('analytics').insert({
        user_id: user.id,
        event_type: 'user_presence',
        event_data: {
          status,
          current_page: currentPage || window.location.pathname,
          timestamp: new Date().toISOString()
        },
        page_url: window.location.href
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Initial presence update
    updatePresence('online');

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updatePresence('online');
      } else {
        updatePresence('away');
      }
    };

    const handleBeforeUnload = () => {
      updatePresence('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Heartbeat every 30 seconds
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updatePresence('online');
      }
    }, 30000);

    return () => {
      updatePresence('offline');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.id]);

  return { onlineUsers, updatePresence };
};
