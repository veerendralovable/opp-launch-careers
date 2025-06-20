
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export const useAdmin = () => {
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [pendingOpportunities, setPendingOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRole, user } = useAuth();

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || userRole === 'admin';

  const fetchOpportunities = async () => {
    if (!user || (!isAdmin && !isModerator)) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const opportunities = data || [];
      setAllOpportunities(opportunities);
      setPendingOpportunities(opportunities.filter(opp => !opp.is_approved));
      
      console.log('Fetched opportunities:', opportunities.length);
    } catch (err: any) {
      console.error('Error fetching opportunities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveOpportunity = async (opportunityId: string) => {
    if (!isAdmin && !isModerator) return false;

    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ 
          is_approved: true,
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', opportunityId);

      if (error) throw error;

      await fetchOpportunities();
      return true;
    } catch (err: any) {
      console.error('Error approving opportunity:', err);
      return false;
    }
  };

  const rejectOpportunity = async (opportunityId: string, reason?: string) => {
    if (!isAdmin && !isModerator) return false;

    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ 
          is_approved: false,
          rejection_reason: reason
        })
        .eq('id', opportunityId);

      if (error) throw error;

      await fetchOpportunities();
      return true;
    } catch (err: any) {
      console.error('Error rejecting opportunity:', err);
      return false;
    }
  };

  useEffect(() => {
    if (user && (isAdmin || isModerator)) {
      fetchOpportunities();
    }
  }, [user, userRole]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || (!isAdmin && !isModerator)) return;

    const channel = supabase
      .channel('admin-opportunities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
        },
        () => {
          console.log('Real-time update received for opportunities');
          fetchOpportunities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, userRole]);

  return {
    allOpportunities,
    pendingOpportunities,
    loading,
    error,
    isAdmin,
    isModerator,
    approveOpportunity,
    rejectOpportunity,
    refetch: fetchOpportunities
  };
};
