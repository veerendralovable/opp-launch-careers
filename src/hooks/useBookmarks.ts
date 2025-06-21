
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

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      setInitialized(true);
      return;
    }
    
    try {
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
      setBookmarks(bookmarkIds);
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user]);

  const toggleBookmark = async (opportunityId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark opportunities.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const isBookmarked = bookmarks.includes(opportunityId);
      
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', opportunityId);
        
        if (error) throw error;
        setBookmarks(prev => prev.filter(id => id !== opportunityId));
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
        setBookmarks(prev => [...prev, opportunityId]);
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
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when user changes
  useEffect(() => {
    setInitialized(false);
    fetchBookmarks();
  }, [user?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !initialized) return;

    if (!subscriptionRef.current) {
      console.log('Setting up bookmarks real-time subscription for user:', user.id);
      
      const channel = supabase
        .channel('bookmarks-changes')
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
            // Only refetch after a delay to prevent loops
            setTimeout(() => {
              fetchBookmarks();
            }, 1000);
          }
        )
        .subscribe();

      subscriptionRef.current = channel;
    }

    return () => {
      if (subscriptionRef.current) {
        console.log('Cleaning up bookmarks subscription');
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user?.id, initialized, fetchBookmarks]);

  return { 
    bookmarks, 
    toggleBookmark, 
    loading: loading && !initialized, 
    error 
  };
};
