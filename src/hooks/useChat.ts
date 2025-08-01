
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id?: string;
  content: string;
  message_type: 'direct' | 'room';
  room_id?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useChat = (roomId?: string, receiverId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const messageData = {
        user_id: user.id,
        title: roomId ? `Message in ${roomId}` : 'Direct Message',
        message: content.trim(),
        type: 'message',
        action_url: roomId ? `/chat/${roomId}` : `/chat/direct/${receiverId}`
      };

      const { error } = await supabase
        .from('notifications')
        .insert([messageData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        let query = supabase
          .from('notifications')
          .select('*')
          .eq('type', 'message')
          .order('created_at', { ascending: true });

        if (roomId) {
          query = query.ilike('action_url', `%${roomId}%`);
        } else if (receiverId) {
          query = query.or(`user_id.eq.${user.id},user_id.eq.${receiverId}`);
        }

        const { data } = await query;
        
        const transformedMessages = (data || []).map(notification => ({
          id: notification.id,
          sender_id: notification.user_id || '',
          receiver_id: receiverId,
          content: notification.message,
          message_type: (roomId ? 'room' : 'direct') as 'direct' | 'room',
          room_id: roomId,
          is_read: notification.is_read || false,
          created_at: notification.created_at,
          updated_at: notification.created_at
        }));
        
        if (mountedRef.current) {
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    // Clean up existing subscription
    if (channelRef.current) {
      console.log('Cleaning up existing chat subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channelName = `chat-messages-${user.id}-${roomId || receiverId || 'global'}-${Date.now()}`;
    
    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `type=eq.message`
          },
          (payload) => {
            const newNotification = payload.new as any;
            const newMessage: Message = {
              id: newNotification.id,
              sender_id: newNotification.user_id || '',
              receiver_id: receiverId,
              content: newNotification.message,
              message_type: (roomId ? 'room' : 'direct') as 'direct' | 'room',
              room_id: roomId,
              is_read: false,
              created_at: newNotification.created_at,
              updated_at: newNotification.created_at
            };

            const belongsToConversation = roomId 
              ? newNotification.action_url?.includes(roomId)
              : newNotification.user_id === user.id || newNotification.user_id === receiverId;

            if (belongsToConversation && mountedRef.current) {
              setMessages(prev => [...prev, newMessage]);
            }
          }
        )
        .subscribe((status) => {
          console.log(`Chat subscription status: ${status}`);
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up chat subscription:', error);
    }

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        console.log('Cleaning up chat subscription on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, roomId, receiverId]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { messages, sendMessage, markAsRead, loading };
};
