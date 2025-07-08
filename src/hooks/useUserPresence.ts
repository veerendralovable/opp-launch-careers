
import { useEffect, useState, useRef } from 'react';
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
  const channelRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const updatePresence = async (status: 'online' | 'offline' | 'away' = 'online', currentPage?: string) => {
    if (!user) return;

    try {
      // Use analytics table to track presence since user_presence table doesn't exist
      await supabase.from('analytics').insert({
        user_id: user.id,
        event_type: 'user_presence',
        metadata: {
          status: status,
          current_page: currentPage || window.location.pathname,
          browser: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
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

    // Clean up any existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Set up real-time presence subscription using analytics table with unique channel name
    const channelName = `user-presence-${user.id}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics',
        },
        async (payload) => {
          // Fetch updated presence data from analytics
          const { data } = await supabase
            .from('analytics')
            .select('*')
            .eq('event_type', 'user_presence')
            .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());
          
          // Transform analytics data to presence format
          const presenceData: UserPresence[] = (data || [])
            .filter(item => item.metadata && typeof item.metadata === 'object')
            .map(item => ({
              user_id: item.user_id || '',
              status: (item.metadata as any)?.status || 'offline',
              last_seen: item.created_at,
              current_page: (item.metadata as any)?.current_page,
              metadata: item.metadata
            }));
          
          if (mountedRef.current) {
            setOnlineUsers(presenceData);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Periodic presence update (every 30 seconds)
    intervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updatePresence('online');
      }
    }, 30000);

    return () => {
      mountedRef.current = false;
      updatePresence('offline');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (channelRef.current) {
        console.log('Cleaning up useUserPresence subscription');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { onlineUsers, updatePresence };
};
