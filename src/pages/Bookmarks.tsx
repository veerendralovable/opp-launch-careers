
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bookmark, 
  ExternalLink, 
  Calendar,
  MapPin,
  Building,
  Search,
  Loader2
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Bookmarks = () => {
  const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching bookmarks for user:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          opportunities (
            id,
            title,
            description,
            type,
            domain,
            location,
            company,
            tags,
            deadline,
            source_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching bookmarks:', fetchError);
        setError(fetchError.message);
        return;
      }

      console.log('Bookmarks fetched successfully:', data?.length);
      setBookmarkedOpportunities(data || []);
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error);
      setError(error.message || 'Failed to fetch bookmarks');
      toast({
        title: "Error",
        description: "Failed to fetch bookmarks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [user?.id, toast]);

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      setBookmarkedOpportunities(prev => 
        prev.filter(bookmark => bookmark.id !== bookmarkId)
      );

      toast({
        title: "Bookmark removed",
        description: "Opportunity has been removed from your bookmarks"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive"
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!initialized) {
      fetchBookmarks();
    }
  }, [initialized, fetchBookmarks]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internship": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Contest": return "bg-green-100 text-green-800 border-green-200";
      case "Event": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Scholarship": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days left`;
  };

  if (loading && !initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchBookmarks}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to view your bookmarks</p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookmarked Opportunities</h1>
              <p className="text-gray-600 mt-2">Your saved opportunities ({bookmarkedOpportunities.length})</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/opportunities">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Find More Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookmarkedOpportunities.length > 0 ? (
          <div className="space-y-6">
            {bookmarkedOpportunities.map(bookmark => {
              const opportunity = bookmark.opportunities;
              if (!opportunity) return null;
              
              return (
                <Card key={bookmark.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getTypeColor(opportunity.type)}>
                            {opportunity.type}
                          </Badge>
                          <Badge variant="outline">{opportunity.domain}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">
                          <Link 
                            to={`/opportunities/${opportunity.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {opportunity.title}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          {opportunity.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {opportunity.company}
                            </div>
                          )}
                          {opportunity.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {opportunity.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDeadline(opportunity.deadline)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Bookmarked on {new Date(bookmark.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className="ml-4 text-blue-600"
                      >
                        <Bookmark className="h-5 w-5 fill-current" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-gray-600">
                      {opportunity.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.tags?.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link to={`/opportunities/${opportunity.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      <a 
                        href={opportunity.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button size="sm">
                          Apply Now
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600 mb-6">
              Start bookmarking opportunities to keep track of the ones you're interested in.
            </p>
            <Link to="/opportunities">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Browse Opportunities
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
