
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('opportunity_id')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error fetching bookmarks:', fetchError);
        setError(fetchError.message);
        return;
      }
      
      setBookmarks(data?.map(b => b.opportunity_id) || []);
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      setError(error.message);
    }
  };

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

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  // Set up real-time subscription for bookmarks
  useEffect(() => {
    if (!user) return;

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
        () => {
          console.log('Bookmarks changed, refetching...');
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { bookmarks, toggleBookmark, loading, error };
};
