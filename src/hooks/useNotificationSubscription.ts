
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NotificationSubscriptionProps {
  onNewNotification: (notification: any) => void;
  onRefresh: () => void;
}

export const useNotificationSubscription = ({ 
  onNewNotification, 
  onRefresh 
}: NotificationSubscriptionProps) => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (!user) return;

    // Clean up existing subscription
    if (channelRef.current) {
      console.log('Cleaning up existing notification subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channelName = `notifications-${user.id}-${Date.now()}`;
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (!mountedRef.current) return;
            
            console.log('New notification received:', payload);
            const newNotification = payload.new;
            
            onNewNotification(newNotification);
            onRefresh();
            
            toast(newNotification.title, {
              description: newNotification.message,
              action: newNotification.action_url ? {
                label: 'View',
                onClick: () => window.open(newNotification.action_url, '_blank')
              } : undefined,
            });
          }
        )
        .subscribe((status) => {
          console.log(`Notification subscription status: ${status}`);
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up notification subscription:', error);
    }

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        console.log('Cleaning up notification subscription on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, onNewNotification, onRefresh]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
};
