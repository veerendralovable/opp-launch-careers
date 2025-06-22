
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookmarkIcon, 
  FileText, 
  TrendingUp, 
  Calendar,
  ExternalLink,
  Loader2,
  User
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const fetchInProgressRef = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user || fetchInProgressRef.current) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);

      console.log('Fetching dashboard data for user:', user.id);

      // Fetch bookmarks with opportunities data
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          opportunities (
            id,
            title,
            type,
            deadline,
            company
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookmarksError) {
        console.error('Error fetching bookmarks:', bookmarksError);
      } else {
        console.log('Bookmarks fetched:', bookmarksData?.length || 0);
      }

      // Fetch resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (resumesError) {
        console.error('Error fetching resumes:', resumesError);
      } else {
        console.log('Resumes fetched:', resumesData?.length || 0);
      }

      setBookmarks(bookmarksData || []);
      setResumes(resumesData || []);
      console.log('Dashboard data fetched successfully');
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setInitialized(true);
      fetchInProgressRef.current = false;
    }
  }, [user?.id]);

  // Initial data fetch - only when user is available and not already initialized
  useEffect(() => {
    if (user && !initialized && !authLoading) {
      fetchDashboardData();
    } else if (!user && !authLoading) {
      setInitialized(true);
      setLoading(false);
    }
  }, [user, initialized, authLoading, fetchDashboardData]);

  // Reset state when user changes
  useEffect(() => {
    if (!authLoading) {
      setInitialized(false);
      setBookmarks([]);
      setResumes([]);
      setError(null);
      fetchInProgressRef.current = false;
    }
  }, [user?.id, authLoading]);

  if (authLoading || (loading && !initialized)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => {
            setError(null);
            setInitialized(false);
          }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-4">You need to be signed in to view your dashboard.</p>
            <Link to="/auth">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bestMatchScore = resumes.length > 0 ? Math.max(...resumes.map(r => r.match_score || 0)) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Your personalized career hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
              <p className="text-xs text-muted-foreground">opportunities saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
              <p className="text-xs text-muted-foreground">tailored resumes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Match</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestMatchScore}%</div>
              <p className="text-xs text-muted-foreground">highest match score</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookmarked Opportunities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bookmarked Opportunities</CardTitle>
                <Link to="/bookmarks">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <CardDescription>Your saved opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookmarks.map(bookmark => {
                const opportunity = bookmark.opportunities;
                if (!opportunity) return null;
                
                return (
                  <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{opportunity.title}</h4>
                      <p className="text-sm text-gray-600">{opportunity.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{opportunity.type}</Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link to={`/opportunities/${opportunity.id}`}>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
              {bookmarks.length === 0 && (
                <p className="text-gray-500 text-center py-4">No bookmarked opportunities yet</p>
              )}
            </CardContent>
          </Card>

          {/* Resume History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resume History</CardTitle>
                <Link to="/tailor">
                  <Button variant="outline" size="sm">Tailor New</Button>
                </Link>
              </div>
              <CardDescription>Your AI-tailored resumes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{resume.name}</h4>
                    <p className="text-sm text-gray-600">Created on {new Date(resume.created_at).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {resume.match_score && (
                        <Badge className="bg-green-100 text-green-800">
                          {resume.match_score}% Match
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {resumes.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tailored resumes yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
