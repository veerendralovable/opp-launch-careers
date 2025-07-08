
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RealtimeNotification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
  action_url?: string;
}

export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (data) {
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.is_read).length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = payload.new as RealtimeNotification;
          
          // Check if notification is for this user or global
          const isForUser = !newNotification.user_id || newNotification.user_id === user.id;
          
          if (isForUser) {
            setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
            setUnreadCount(prev => prev + 1);
            
            // Show toast notification
            toast(newNotification.title, {
              description: newNotification.message,
              action: newNotification.action_url ? {
                label: 'View',
                onClick: () => window.open(newNotification.action_url, '_blank')
              } : undefined,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .or(`user_id.eq.${user?.id},user_id.is.null`)
        .eq('is_read', false);

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
};
