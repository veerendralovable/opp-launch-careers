
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
  
  const subscriptionRef = useRef<any>(null);
  const fetchingRef = useRef(false);
  const lastFiltersRef = useRef<string>('');

  const fetchOpportunities = useCallback(async () => {
    if (fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      console.log('Fetching opportunities with filters:', filters);
      
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .gte('deadline', new Date().toISOString().split('T')[0])
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
      
      console.log('Opportunities fetched successfully:', data?.length);
      setOpportunities(data || []);
    } catch (err: any) {
      console.error('Error in fetchOpportunities:', err);
      setError(err.message || 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
      setInitialized(true);
      fetchingRef.current = false;
    }
  }, [filters?.type, filters?.domain, filters?.search]);

  // Initial fetch - only run once when component mounts
  useEffect(() => {
    if (!initialized) {
      fetchOpportunities();
    }
  }, [initialized, fetchOpportunities]);

  // Handle filter changes - only refetch if filters actually changed
  useEffect(() => {
    if (!initialized) return;

    const currentFilters = JSON.stringify(filters);
    if (currentFilters !== lastFiltersRef.current) {
      lastFiltersRef.current = currentFilters;
      
      const timeoutId = setTimeout(() => {
        if (!fetchingRef.current) {
          fetchOpportunities();
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [filters?.type, filters?.domain, filters?.search, initialized, fetchOpportunities]);

  // Clean up subscription when component unmounts
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up opportunities subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  // Set up real-time subscription only after initial fetch
  useEffect(() => {
    if (!initialized || subscriptionRef.current) return;

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
          // Debounced refetch to prevent loops
          setTimeout(() => {
            if (!fetchingRef.current) {
              fetchOpportunities();
            }
          }, 1000);
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
  }, [initialized, fetchOpportunities]);

  return { 
    opportunities, 
    loading: loading && !initialized, 
    error, 
    refetch: fetchOpportunities 
  };
};
