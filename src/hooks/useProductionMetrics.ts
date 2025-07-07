
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProductionMetrics {
  totalOpportunities: number;
  activeOpportunities: number;
  totalUsers: number;
  totalApplications: number;
  recentActivity: any[];
  pendingCount: number;
  approvedCount: number;
}

export const useProductionMetrics = () => {
  const [metrics, setMetrics] = useState<ProductionMetrics>({
    totalOpportunities: 0,
    activeOpportunities: 0,
    totalUsers: 0,
    totalApplications: 0,
    recentActivity: [],
    pendingCount: 0,
    approvedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useAuth();

  const fetchMetrics = useCallback(async () => {
    if (!userRole || (userRole !== 'admin' && userRole !== 'moderator')) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch opportunities
      const { data: opportunities, error: oppError } = await supabase
        .from('opportunities')
        .select('*');

      if (oppError) throw oppError;

      // Fetch users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch applications (real data instead of bookmarks)
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('*');

      if (applicationsError) throw applicationsError;

      const now = new Date();
      const activeOpportunities = opportunities?.filter(opp => 
        new Date(opp.deadline) > now && opp.is_approved
      ) || [];

      const pendingOpportunities = opportunities?.filter(opp => !opp.is_approved) || [];
      const approvedOpportunities = opportunities?.filter(opp => opp.is_approved) || [];

      // Get recent activity (last 10 opportunities)
      const recentActivity = opportunities
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map(opp => ({
          event_type: opp.is_approved ? 'Opportunity Approved' : 'Opportunity Submitted',
          created_at: opp.created_at,
          details: opp.title
        })) || [];

      setMetrics({
        totalOpportunities: opportunities?.length || 0,
        activeOpportunities: activeOpportunities.length,
        totalUsers: profiles?.length || 0,
        totalApplications: applications?.length || 0,
        recentActivity,
        pendingCount: pendingOpportunities.length,
        approvedCount: approvedOpportunities.length
      });
    } catch (err: any) {
      console.error('Error fetching production metrics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    fetchMetrics();

    // Set up real-time updates
    const channel = supabase
      .channel('metrics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
        },
        () => {
          console.log('Metrics update received');
          setTimeout(() => fetchMetrics(), 1000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          console.log('Profiles update received');
          setTimeout(() => fetchMetrics(), 1000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
        },
        () => {
          console.log('Applications update received');
          setTimeout(() => fetchMetrics(), 1000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
};
