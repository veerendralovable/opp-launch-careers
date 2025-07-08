
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const subscriptionRef = useRef<any>(null);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  const fetchBookmarks = useCallback(async () => {
    if (!user || fetchingRef.current) {
      if (!user) {
        setBookmarks([]);
        setInitialized(true);
      }
      return;
    }
    
    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      console.log('Fetching bookmarks for user:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('opportunity_id')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error fetching bookmarks:', fetchError);
        setError(fetchError.message);
        return;
      }
      
      const bookmarkIds = data?.map(b => b.opportunity_id) || [];
      console.log('Bookmarks fetched:', bookmarkIds.length);
      
      if (mountedRef.current) {
        setBookmarks(bookmarkIds);
      }
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      setError(error.message);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setInitialized(true);
      }
      fetchingRef.current = false;
    }
  }, [user?.id]);

  const toggleBookmark = async (opportunityId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark opportunities.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isBookmarked = bookmarks.includes(opportunityId);
      
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId);
        
        if (error) throw error;
        
        if (mountedRef.current) {
          setBookmarks(prev => prev.filter(id => id !== opportunityId));
        }
        
        toast({
          title: "Bookmark removed",
          description: "Opportunity removed from your bookmarks.",
        });
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            opportunity_id: opportunityId,
          });
        
        if (error) throw error;
        
        if (mountedRef.current) {
          setBookmarks(prev => [...prev, opportunityId]);
        }
        
        toast({
          title: "Bookmark added",
          description: "Opportunity saved to your bookmarks.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Initial fetch - only when user changes and not already initialized for that user
  useEffect(() => {
    if (user && !initialized) {
      fetchBookmarks();
    } else if (!user) {
      setBookmarks([]);
      setInitialized(true);
    }
  }, [user?.id, initialized, fetchBookmarks]);

  // Set up real-time subscription only after initial fetch
  useEffect(() => {
    if (!user || !initialized) return;

    // Clean up existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    console.log('Setting up bookmarks real-time subscription for user:', user.id);
    
    const channelName = `bookmarks-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Bookmarks changed:', payload);
          // Debounced refetch to prevent loops
          setTimeout(() => {
            if (!fetchingRef.current && mountedRef.current) {
              fetchBookmarks();
            }
          }, 1000);
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up bookmarks subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, initialized, fetchBookmarks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (subscriptionRef.current) {
        console.log('Cleaning up bookmarks subscription on unmount');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, []);

  return { 
    bookmarks, 
    toggleBookmark, 
    loading: loading && !initialized, 
    error 
  };
};
