
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UseRealtimeOptions {
  table: 'opportunities' | 'applications' | 'notifications' | 'bookmarks' | 'analytics';
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

interface RealtimeData {
  id: string;
  [key: string]: any;
}

export const useRealtime = (options: UseRealtimeOptions) => {
  const [data, setData] = useState<RealtimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const { table, event = '*', filter } = options;

  useEffect(() => {
    if (!user) return;

    const fetchInitialData = async () => {
      try {
        // Simplify the query to avoid deep type instantiation
        const query = supabase.from(table as any).select('*');
        if (filter) {
          const [field, value] = filter.split('=');
          query.eq(field, value);
        }
        const { data: initialData, error } = await query;
        
        if (error) {
          console.error(`Error fetching ${table}:`, error);
          setData([]);
        } else {
          // Use unknown first to avoid type conversion issues
          setData((initialData as unknown as RealtimeData[]) || []);
        }
      } catch (error) {
        console.error(`Error fetching ${table}:`, error);
        setData([]);
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
            setData(prev => prev.map((item: RealtimeData) => 
              item.id === payload.new.id ? payload.new : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter((item: RealtimeData) => item.id !== payload.old.id));
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
