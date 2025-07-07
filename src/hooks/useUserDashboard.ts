
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserDashboardStats {
  bookmarks: number;
  applications: number;
  views: number;
  profileCompletion: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'bookmark' | 'view' | 'opportunity_view';
  title: string;
  date: string;
  status: string;
  opportunity_id?: string;
}

export const useUserDashboard = () => {
  const [stats, setStats] = useState<UserDashboardStats>({
    bookmarks: 0,
    applications: 0,
    views: 0,
    profileCompletion: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch bookmarks count
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id);

      if (bookmarksError) throw bookmarksError;

      // Fetch applications count
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id);

      if (applicationsError) throw applicationsError;

      // Fetch recently viewed count (as proxy for views)
      const { data: recentlyViewed, error: viewsError } = await supabase
        .from('recently_viewed')
        .select('id')
        .eq('user_id', user.id);

      if (viewsError) throw viewsError;

      // Fetch profile completion
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('profile_completion_score')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setStats({
        bookmarks: bookmarks?.length || 0,
        applications: applications?.length || 0,
        views: recentlyViewed?.length || 0,
        profileCompletion: profile?.profile_completion_score || 0
      });

    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchRecentActivity = useCallback(async () => {
    if (!user) return;

    try {
      const activities: RecentActivity[] = [];

      // Fetch recent applications
      const { data: recentApplications } = await supabase
        .from('applications')
        .select(`
          id,
          applied_at,
          status,
          opportunities (
            id,
            title,
            company
          )
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(5);

      recentApplications?.forEach(app => {
        if (app.opportunities) {
          activities.push({
            id: app.id,
            type: 'application',
            title: `Applied to ${app.opportunities.title} at ${app.opportunities.company}`,
            date: new Date(app.applied_at).toLocaleDateString(),
            status: app.status,
            opportunity_id: app.opportunities.id
          });
        }
      });

      // Fetch recent bookmarks
      const { data: recentBookmarks } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          opportunities (
            id,
            title,
            company
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      recentBookmarks?.forEach(bookmark => {
        if (bookmark.opportunities) {
          activities.push({
            id: bookmark.id,
            type: 'bookmark',
            title: `Bookmarked ${bookmark.opportunities.title}`,
            date: new Date(bookmark.created_at).toLocaleDateString(),
            status: 'saved',
            opportunity_id: bookmark.opportunities.id
          });
        }
      });

      // Fetch recently viewed
      const { data: recentViews } = await supabase
        .from('recently_viewed')
        .select(`
          id,
          viewed_at,
          opportunities (
            id,
            title,
            company
          )
        `)
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(5);

      recentViews?.forEach(view => {
        if (view.opportunities) {
          activities.push({
            id: view.id,
            type: 'view',
            title: `Viewed ${view.opportunities.title}`,
            date: new Date(view.viewed_at || '').toLocaleDateString(),
            status: 'viewed',
            opportunity_id: view.opportunities.id
          });
        }
      });

      // Sort all activities by date and take the most recent 10
      const sortedActivities = activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
      .channel('user-bookmarks')
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
      .channel('user-applications')
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

    const recentlyViewedChannel = supabase
      .channel('user-recently-viewed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recently_viewed',
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
      supabase.removeChannel(recentlyViewedChannel);
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
