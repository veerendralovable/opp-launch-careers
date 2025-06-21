
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export const useOpportunities = (filters?: {
  type?: string;
  domain?: string;
  search?: string;
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Use ref to prevent infinite loops
  const filtersRef = useRef(filters);
  const subscriptionRef = useRef<any>(null);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters?.type, filters?.domain, filters?.search]);

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching opportunities with filters:', filtersRef.current);
      
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .gte('deadline', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      const currentFilters = filtersRef.current;
      if (currentFilters?.type && currentFilters.type !== 'All') {
        query = query.eq('type', currentFilters.type);
      }

      if (currentFilters?.domain && currentFilters.domain !== 'All') {
        query = query.eq('domain', currentFilters.domain);
      }

      if (currentFilters?.search) {
        query = query.or(`title.ilike.%${currentFilters.search}%,description.ilike.%${currentFilters.search}%,company.ilike.%${currentFilters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching opportunities:', fetchError);
        setError(fetchError.message);
        return;
      }
      
      console.log('Opportunities fetched successfully:', data?.length);
      setOpportunities(data || []);
    } catch (err: any) {
      console.error('Error in fetchOpportunities:', err);
      setError(err.message || 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // Initial fetch - only run once
  useEffect(() => {
    if (!initialized) {
      fetchOpportunities();
    }
  }, [initialized, fetchOpportunities]);

  // Handle filter changes - but prevent infinite loops
  useEffect(() => {
    if (initialized) {
      // Debounce the filter changes
      const timeoutId = setTimeout(() => {
        fetchOpportunities();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [filters?.type, filters?.domain, filters?.search, initialized, fetchOpportunities]);

  // Set up real-time subscription - only once
  useEffect(() => {
    if (!subscriptionRef.current) {
      console.log('Setting up real-time subscription for opportunities');
      
      const channel = supabase
        .channel('opportunities-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'opportunities',
          },
          (payload) => {
            console.log('Opportunities table changed:', payload);
            // Only refetch if we're already initialized to prevent loops
            if (initialized) {
              setTimeout(() => {
                fetchOpportunities();
              }, 1000);
            }
          }
        )
        .subscribe();

      subscriptionRef.current = channel;
    }

    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up opportunities subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [initialized, fetchOpportunities]);

  return { 
    opportunities, 
    loading: loading && !initialized, 
    error, 
    refetch: fetchOpportunities 
  };
};
