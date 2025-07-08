import React from 'react';
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
  User
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import AnimatedButton from '@/components/ui/animated-button';

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
      }

      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (resumesError) {
        console.error('Error fetching resumes:', resumesError);
      }

      setBookmarks(bookmarksData || []);
      setResumes(resumesData || []);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setInitialized(true);
      fetchInProgressRef.current = false;
    }
  }, [user?.id]);

  useEffect(() => {
    if (user && !initialized && !authLoading) {
      fetchDashboardData();
    } else if (!user && !authLoading) {
      setInitialized(true);
      setLoading(false);
    }
  }, [user, initialized, authLoading, fetchDashboardData]);

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
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <AnimatedButton onClick={() => {
            setError(null);
            setInitialized(false);
          }}>
            Try Again
          </AnimatedButton>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full animate-fade-in">
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
            <p className="text-gray-600 mb-4">You need to be signed in to view your dashboard.</p>
            <Link to="/auth">
              <AnimatedButton className="w-full">Sign In</AnimatedButton>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bestMatchScore = resumes.length > 0 ? Math.max(...resumes.map(r => r.match_score || 0)) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 animate-fade-in">
      <div className="container-responsive py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-responsive font-bold text-gray-900">Dashboard</h1>
          <p className="text-responsive text-gray-600 mt-2">Your personalized career hub</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookmarks.length}</div>
              <p className="text-xs text-muted-foreground">opportunities saved</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
              <p className="text-xs text-muted-foreground">tailored resumes</p>
            </CardContent>
          </Card>

          <Card className="card-hover sm:col-span-2 lg:col-span-1">
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Bookmarked Opportunities */}
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base md:text-lg">Bookmarked Opportunities</CardTitle>
                <Link to="/bookmarks">
                  <AnimatedButton variant="outline" size="sm">View All</AnimatedButton>
                </Link>
              </div>
              <CardDescription>Your saved opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookmarks.map(bookmark => {
                const opportunity = bookmark.opportunities;
                if (!opportunity) return null;
                
                return (
                  <div key={bookmark.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{opportunity.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{opportunity.company}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline">{opportunity.type}</Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(opportunity.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link to={`/opportunities/${opportunity.id}`}>
                      <Button size="sm" variant="ghost" className="hover:scale-110 transition-transform">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
              {bookmarks.length === 0 && (
                <div className="text-center py-6 md:py-8">
                  <BookmarkIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No bookmarked opportunities yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume History */}
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base md:text-lg">Resume History</CardTitle>
                <Link to="/tailor">
                  <AnimatedButton variant="outline" size="sm">Tailor New</AnimatedButton>
                </Link>
              </div>
              <CardDescription>Your AI-tailored resumes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumes.map(resume => (
                <div key={resume.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{resume.name}</h4>
                    <p className="text-sm text-gray-600">Created on {new Date(resume.created_at).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {resume.match_score && (
                        <Badge className="bg-green-100 text-green-800">
                          {resume.match_score}% Match
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="hover:scale-110 transition-transform">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {resumes.length === 0 && (
                <div className="text-center py-6 md:py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tailored resumes yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
