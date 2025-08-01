
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

    // Clean up existing subscription
    if (channelRef.current) {
      console.log('Cleaning up existing user presence subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channelName = `user-presence-${user.id}-${Date.now()}`;
    
    try {
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
            try {
              const { data } = await supabase
                .from('analytics')
                .select('*')
                .eq('event_type', 'user_presence')
                .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());
              
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
            } catch (error) {
              console.error('Error processing presence data:', error);
            }
          }
        )
        .subscribe((status) => {
          console.log(`User presence subscription status: ${status}`);
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up user presence subscription:', error);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

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
        console.log('Cleaning up user presence subscription on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { onlineUsers, updatePresence };
};
