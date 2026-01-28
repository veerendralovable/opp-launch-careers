import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
  totalOpportunities: number;
  pendingOpportunities: number;
  approvedOpportunities: number;
  expiredOpportunities: number;
  totalUsers: number;
  totalBookmarks: number;
  totalApplications: number;
  recentOpportunities: any[];
  recentUsers: any[];
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalOpportunities: 0,
    pendingOpportunities: 0,
    approvedOpportunities: 0,
    expiredOpportunities: 0,
    totalUsers: 0,
    totalBookmarks: 0,
    totalApplications: 0,
    recentOpportunities: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const { userRole, user } = useAuth();

  const isAdmin = userRole === 'admin';

  const fetchStats = async () => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [
        opportunitiesResult,
        profilesResult,
        bookmarksResult,
        applicationsResult,
      ] = await Promise.all([
        supabase.from('opportunities').select('id, is_approved, is_expired, created_at, title, type, company', { count: 'exact' }),
        supabase.from('profiles').select('id, name, email, created_at', { count: 'exact' }),
        supabase.from('bookmarks').select('id', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact' }),
      ]);

      const opportunities = opportunitiesResult.data || [];
      const profiles = profilesResult.data || [];

      setStats({
        totalOpportunities: opportunities.length,
        pendingOpportunities: opportunities.filter(o => !o.is_approved).length,
        approvedOpportunities: opportunities.filter(o => o.is_approved).length,
        expiredOpportunities: opportunities.filter(o => o.is_expired).length,
        totalUsers: profilesResult.count || profiles.length,
        totalBookmarks: bookmarksResult.count || 0,
        totalApplications: applicationsResult.count || 0,
        recentOpportunities: opportunities.slice(0, 5),
        recentUsers: profiles.slice(0, 5),
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, userRole]);

  return {
    stats,
    loading,
    isAdmin,
    refetch: fetchStats,
  };
};
