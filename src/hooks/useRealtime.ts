
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseRealtimeOptions {
  table: 'opportunities' | 'applications' | 'notifications' | 'bookmarks' | 'analytics';
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

export const useRealtime = (options: UseRealtimeOptions) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const { table, event = '*', filter } = options;

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        let query = supabase.from(table).select('*');
        if (filter) {
          const [field, value] = filter.split('=');
          query = query.eq(field, value);
        }
        const { data: initialData } = await query;
        setData(initialData || []);
      } catch (error) {
        console.error(`Error fetching ${table}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Create a unique channel name to avoid conflicts
    const channelName = `realtime-${table}-${user.id}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: event as any,
          schema: 'public',
          table,
          filter: filter || undefined,
        },
        (payload: any) => {
          console.log(`Realtime update for ${table}:`, payload);
          
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map((item: any) => 
              item.id === payload.new.id ? payload.new : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter((item: any) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, filter, user]);

  return { data, loading, setData };
};
