
import { useState, useEffect } from 'react';
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

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const messageData = {
        sender_id: user.id,
        content: content.trim(),
        message_type: roomId ? 'room' : 'direct',
        ...(roomId && { room_id: roomId }),
        ...(receiverId && { receiver_id: receiverId }),
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('receiver_id', user?.id);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (roomId) {
          query = query.eq('room_id', roomId);
        } else if (receiverId) {
          query = query.or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`);
        } else {
          query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
        }

        const { data } = await query;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Only add message if it belongs to current conversation
          const belongsToConversation = roomId 
            ? newMessage.room_id === roomId
            : (newMessage.sender_id === user.id && newMessage.receiver_id === receiverId) ||
              (newMessage.sender_id === receiverId && newMessage.receiver_id === user.id);

          if (belongsToConversation) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, roomId, receiverId]);

  return { messages, sendMessage, markAsRead, loading };
};
