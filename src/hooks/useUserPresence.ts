
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPresence {
  user_id: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
  current_page?: string;
  metadata?: any;
}

export const useUserPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const { user } = useAuth();

  const updatePresence = async (status: 'online' | 'offline' | 'away' = 'online', currentPage?: string) => {
    if (!user) return;

    try {
      await supabase.rpc('update_user_presence', {
        _status: status,
        _current_page: currentPage || window.location.pathname,
        _metadata: { browser: navigator.userAgent }
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Set initial presence
    updatePresence('online');

    // Update presence on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updatePresence('online');
      } else {
        updatePresence('away');
      }
    };

    // Update presence before page unload
    const handleBeforeUnload = () => {
      updatePresence('offline');
    };

    // Set up real-time presence subscription
    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
        },
        async () => {
          // Fetch updated presence data
          const { data } = await supabase
            .from('user_presence')
            .select('*')
            .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());
          
          setOnlineUsers(data || []);
        }
      )
      .subscribe();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Periodic presence update (every 30 seconds)
    const presenceInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updatePresence('online');
      }
    }, 30000);

    return () => {
      updatePresence('offline');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(presenceInterval);
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { onlineUsers, updatePresence };
};
