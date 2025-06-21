
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export const useOpportunities = (filters?: {
  type?: string;
  domain?: string;
  search?: string;
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .gte('deadline', new Date().toISOString().split('T')[0]) // Only show future opportunities
        .order('created_at', { ascending: false });

      if (filters?.type && filters.type !== 'All') {
        query = query.eq('type', filters.type);
      }

      if (filters?.domain && filters.domain !== 'All') {
        query = query.eq('domain', filters.domain);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching opportunities:', fetchError);
        setError(fetchError.message);
        return;
      }
      
      setOpportunities(data || []);
    } catch (err: any) {
      console.error('Error in fetchOpportunities:', err);
      setError(err.message || 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [filters?.type, filters?.domain, filters?.search]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('opportunities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
        },
        () => {
          console.log('Opportunities table changed, refetching...');
          fetchOpportunities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { opportunities, loading, error, refetch: fetchOpportunities };
};
