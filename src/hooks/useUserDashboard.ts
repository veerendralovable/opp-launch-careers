import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserDashboardStats {
  bookmarks: number;
  applications: number;
  profileViews: number;
  profileCompletion: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'bookmark';
  title: string;
  description: string;
  created_at: string;
}

export const useUserDashboard = () => {
  const [stats, setStats] = useState<UserDashboardStats>({
    bookmarks: 0,
    applications: 0,
    profileViews: 0,
    profileCompletion: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const calculateProfileCompletion = useCallback((profile: any) => {
    if (!profile) return 0;
    
    const fields = ['name', 'email', 'bio', 'college', 'location', 'skills', 'linkedin_url'];
    const filledFields = fields.filter(field => {
      const value = profile[field];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.trim && value.trim().length > 0;
    });
    
    return Math.round((filledFields.length / fields.length) * 100);
  }, []);

  const fetchUserStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch bookmarks count
      const { count: bookmarksCount, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (bookmarksError) console.error('Bookmarks error:', bookmarksError);

      // Fetch applications count
      const { count: applicationsCount, error: applicationsError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (applicationsError) console.error('Applications error:', applicationsError);

      // Fetch profile for completion calculation
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) console.error('Profile error:', profileError);

      setStats({
        bookmarks: bookmarksCount || 0,
        applications: applicationsCount || 0,
        profileViews: 0, // Will implement view tracking later
        profileCompletion: calculateProfileCompletion(profile)
      });

    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, calculateProfileCompletion]);

  const fetchRecentActivity = useCallback(async () => {
    if (!user) return;

    try {
      const activities: RecentActivity[] = [];

      // Fetch recent applications with opportunity details
      const { data: recentApplications, error: appError } = await supabase
        .from('applications')
        .select(`
          id,
          applied_at,
          status,
          opportunity_id
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(5);

      if (!appError && recentApplications) {
        // Fetch opportunity details for applications
        for (const app of recentApplications) {
          const { data: opp } = await supabase
            .from('opportunities')
            .select('title, company')
            .eq('id', app.opportunity_id)
            .single();
          
          if (opp) {
            activities.push({
              id: app.id,
              type: 'application',
              title: `Applied to ${opp.title}`,
              description: opp.company || 'Unknown company',
              created_at: app.applied_at
            });
          }
        }
      }

      // Fetch recent bookmarks with opportunity details
      const { data: recentBookmarks, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          opportunity_id
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!bookmarkError && recentBookmarks) {
        for (const bookmark of recentBookmarks) {
          const { data: opp } = await supabase
            .from('opportunities')
            .select('title, company')
            .eq('id', bookmark.opportunity_id)
            .single();
          
          if (opp) {
            activities.push({
              id: bookmark.id,
              type: 'bookmark',
              title: `Bookmarked ${opp.title}`,
              description: opp.company || 'Unknown company',
              created_at: bookmark.created_at
            });
          }
        }
      }

      // Sort all activities by date
      const sortedActivities = activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setRecentActivity(sortedActivities);

    } catch (err: any) {
      console.error('Error fetching recent activity:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentActivity();
    }
  }, [user, fetchUserStats, fetchRecentActivity]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const bookmarksChannel = supabase
      .channel(`user-bookmarks-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchUserStats();
          fetchRecentActivity();
        }
      )
      .subscribe();

    const applicationsChannel = supabase
      .channel(`user-applications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchUserStats();
          fetchRecentActivity();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookmarksChannel);
      supabase.removeChannel(applicationsChannel);
    };
  }, [user, fetchUserStats, fetchRecentActivity]);

  return {
    stats,
    recentActivity,
    loading,
    error,
    refetch: () => {
      fetchUserStats();
      fetchRecentActivity();
    }
  };
};
