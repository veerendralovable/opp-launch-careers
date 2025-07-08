
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseRealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

export const useRealtime = <T>({ table, event = '*', filter }: UseRealtimeOptions) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        let query = supabase.from(table).select('*');
        if (filter) {
          query = query.eq(filter.split('=')[0], filter.split('=')[1]);
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

    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          filter: filter || undefined,
        },
        (payload) => {
          console.log(`Realtime update for ${table}:`, payload);
          
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as T, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              (item as any).id === (payload.new as any).id ? payload.new as T : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => (item as any).id !== (payload.old as any).id));
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
