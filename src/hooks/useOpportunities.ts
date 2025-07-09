
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export const useOpportunities = (filters?: {
  type?: string;
  domain?: string;
  search?: string;
  location?: string;
  remoteOnly?: boolean;
  salaryRange?: string;
  experienceLevel?: string;
  employmentType?: string;
  featured?: boolean;
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  const subscriptionRef = useRef<any>(null);
  const fetchingRef = useRef(false);
  const lastFiltersRef = useRef<string>('');

  const fetchOpportunities = useCallback(async (force = false) => {
    if (fetchingRef.current && !force) return;
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      console.log('Fetching opportunities with filters:', filters);
      
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .eq('is_expired', false)
        .order('featured', { ascending: false })
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.type && filters.type !== 'All') {
        query = query.eq('type', filters.type);
      }

      if (filters?.domain && filters.domain !== 'All') {
        query = query.eq('domain', filters.domain);
      }

      if (filters?.location && filters.location !== 'All') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.remoteOnly) {
        query = query.eq('remote_work_allowed', true);
      }

      if (filters?.experienceLevel && filters.experienceLevel !== 'All') {
        query = query.eq('experience_required', filters.experienceLevel);
      }

      if (filters?.employmentType && filters.employmentType !== 'All') {
        query = query.eq('employment_type', filters.employmentType);
      }

      if (filters?.featured) {
        query = query.eq('featured', true);
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
  }, [filters?.type, filters?.domain, filters?.search, filters?.location, filters?.remoteOnly, filters?.experienceLevel, filters?.employmentType, filters?.featured]);

  useEffect(() => {
    if (!initialized) {
      fetchOpportunities();
    }
  }, [initialized, fetchOpportunities]);

  useEffect(() => {
    if (!initialized) return;

    const currentFilters = JSON.stringify(filters);
    if (currentFilters !== lastFiltersRef.current) {
      lastFiltersRef.current = currentFilters;
      
      const timeoutId = setTimeout(() => {
        if (!fetchingRef.current) {
          fetchOpportunities(true);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [filters, initialized, fetchOpportunities]);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up opportunities subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!initialized || subscriptionRef.current) return;

    const channelName = `opportunities-changes-${Date.now()}-${Math.random()}`;
    console.log('Setting up real-time subscription for opportunities:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
        },
        (payload) => {
          console.log('Opportunities table changed:', payload);
          setTimeout(() => {
            if (!fetchingRef.current) {
              fetchOpportunities(true);
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
    refetch: () => fetchOpportunities(true)
  };
};
