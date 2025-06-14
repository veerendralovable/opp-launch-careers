
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];
type AdminAction = Database['public']['Tables']['admin_actions']['Row'];

export const useAdmin = () => {
  const [pendingOpportunities, setPendingOpportunities] = useState<Opportunity[]>([]);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('is_admin', {
        _user_id: user.id
      });
      
      if (error) throw error;
      setIsAdmin(data);
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchPendingOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          profiles:submitted_by(name, email)
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingOpportunities(data || []);
    } catch (error: any) {
      console.error('Error fetching pending opportunities:', error);
    }
  };

  const fetchAllOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          profiles:submitted_by(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllOpportunities(data || []);
    } catch (error: any) {
      console.error('Error fetching all opportunities:', error);
    }
  };

  const markExpiredOpportunities = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('opportunities')
        .update({ is_expired: true })
        .lt('deadline', today)
        .eq('is_expired', false);

      if (error) throw error;
      
      // Refresh data after marking expired
      fetchAllOpportunities();
    } catch (error: any) {
      console.error('Error marking expired opportunities:', error);
    }
  };

  const logAdminAction = async (actionType: string, targetType: string, targetId?: string, details?: any) => {
    if (!user) return;

    try {
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user.id,
          action_type: actionType,
          target_type: targetType,
          target_id: targetId,
          details: details
        });
    } catch (error: any) {
      console.error('Error logging admin action:', error);
    }
  };

  const approveOpportunity = async (opportunityId: string) => {
    if (!user || !isAdmin) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({
          is_approved: true,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', opportunityId);

      if (error) throw error;

      await logAdminAction('approve_opportunity', 'opportunity', opportunityId);
      
      toast({
        title: "Opportunity Approved",
        description: "The opportunity has been successfully approved.",
      });

      fetchPendingOpportunities();
      fetchAllOpportunities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectOpportunity = async (opportunityId: string, rejectionReason: string) => {
    if (!user || !isAdmin) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({
          is_approved: false,
          rejection_reason: rejectionReason,
          approved_by: user.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', opportunityId);

      if (error) throw error;

      await logAdminAction('reject_opportunity', 'opportunity', opportunityId, { reason: rejectionReason });
      
      toast({
        title: "Opportunity Rejected",
        description: "The opportunity has been rejected.",
      });

      fetchPendingOpportunities();
      fetchAllOpportunities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteOpportunity = async (opportunityId: string) => {
    if (!user || !isAdmin) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', opportunityId);

      if (error) throw error;

      await logAdminAction('delete_opportunity', 'opportunity', opportunityId);
      
      toast({
        title: "Opportunity Deleted",
        description: "The opportunity has been permanently deleted.",
      });

      fetchPendingOpportunities();
      fetchAllOpportunities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingOpportunities();
      fetchAllOpportunities();
      markExpiredOpportunities(); // Mark expired opportunities on load
    }
  }, [isAdmin]);

  // Set up real-time subscription for opportunities
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-opportunities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
        },
        () => {
          fetchPendingOpportunities();
          fetchAllOpportunities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return {
    pendingOpportunities,
    allOpportunities,
    userRoles,
    adminActions,
    loading,
    isAdmin,
    approveOpportunity,
    rejectOpportunity,
    deleteOpportunity,
    markExpiredOpportunities,
    refetch: () => {
      fetchPendingOpportunities();
      fetchAllOpportunities();
    }
  };
};
