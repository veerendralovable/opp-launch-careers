import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  MapPin, 
  Building, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  ArrowLeft,
  Share2,
  Eye,
  Copy,
  Check
} from 'lucide-react';

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const fetchOpportunity = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .eq('is_approved', true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Not Found",
          description: "This opportunity doesn't exist or hasn't been approved yet.",
          variant: "destructive"
        });
        navigate('/opportunities');
        return;
      }
      
      setOpportunity(data);
      setViewCount(data.view_count || 0);

    } catch (error: any) {
      console.error('Error fetching opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunity details",
        variant: "destructive"
      });
      navigate('/opportunities');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  const incrementViewCount = useCallback(async () => {
    if (!id) return;
    
    try {
      // Use the RPC function to increment view count (works for both authenticated and anonymous users)
      await supabase.rpc('increment_view_count', { _opportunity_id: id });
      setViewCount(prev => prev + 1);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }, [id]);

  const checkBookmarkStatus = useCallback(async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('opportunity_id', id)
        .maybeSingle();

      setIsBookmarked(!!data);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  }, [user, id]);

  const trackView = useCallback(async () => {
    if (!user || !id) return;

    try {
      await supabase.from('analytics').insert({
        user_id: user.id,
        event_type: 'opportunity_view',
        event_data: { opportunity_id: id },
        page_url: window.location.href
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [user, id]);

  useEffect(() => {
    fetchOpportunity();
    incrementViewCount();
    
    if (user) {
      checkBookmarkStatus();
      trackView();
    }
  }, [fetchOpportunity, incrementViewCount, checkBookmarkStatus, trackView, user]);

  // Set up real-time subscription for view count
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`opportunity-views-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'opportunities',
          filter: `id=eq.${id}`
        },
        (payload) => {
          if (payload.new && typeof payload.new.view_count === 'number') {
            setViewCount(payload.new.view_count);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const toggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to bookmark opportunities",
        variant: "destructive"
      });
      return;
    }

    try {
      setBookmarkLoading(true);

      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('opportunity_id', id);
        
        setIsBookmarked(false);
        toast({
          title: "Removed from bookmarks",
          description: "Opportunity removed from your bookmarks"
        });
      } else {
        await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            opportunity_id: id
          });
        
        setIsBookmarked(true);
        toast({
          title: "Added to bookmarks",
          description: "Opportunity saved to your bookmarks"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setBookmarkLoading(false);
    }
  };

  const generateShareContent = () => {
    if (!opportunity) return '';
    
    const platformUrl = window.location.href;
    const deadline = opportunity.deadline 
      ? new Date(opportunity.deadline).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : 'Not specified';
    
    const lines = [
      `📢 ${opportunity.type}: ${opportunity.title}`,
      '',
      opportunity.company ? `🏢 ${opportunity.company}` : null,
      opportunity.location ? `📍 ${opportunity.location}` : null,
      opportunity.domain ? `🎯 Domain: ${opportunity.domain}` : null,
      `📅 Deadline: ${deadline}`,
      '',
      '🔗 View & Apply:',
      platformUrl,
      '',
      '— Shared via OpportunityHub'
    ].filter(Boolean);
    
    return lines.join('\n');
  };

  const shareOpportunity = async () => {
    const shareContent = generateShareContent();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${opportunity?.type}: ${opportunity?.title}`,
          text: shareContent,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error - fall back to clipboard
        copyToClipboard(shareContent);
      }
    } else {
      copyToClipboard(shareContent);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Opportunity details copied. Share it anywhere!"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "internship": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "job": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "contest": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "event": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "scholarship": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "fellowship": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "workshop": return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const isExpired = opportunity && opportunity.deadline && new Date(opportunity.deadline) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Opportunity not found</h2>
          <p className="text-muted-foreground mb-4">The opportunity you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/opportunities')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/opportunities')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={shareOpportunity}
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Share'}
            </Button>
            
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 mr-2" />
              ) : (
                <Bookmark className="h-4 w-4 mr-2" />
              )}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge className={getTypeColor(opportunity.type)}>
                        {opportunity.type}
                      </Badge>
                      <Badge variant="outline">{opportunity.domain}</Badge>
                      {opportunity.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          ⭐ Featured
                        </Badge>
                      )}
                      {isExpired && (
                        <Badge variant="destructive">
                          <Clock className="h-3 w-3 mr-1" />
                          Expired
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-2xl mb-3">{opportunity.title}</CardTitle>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                      {opportunity.employment_type && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {opportunity.employment_type}
                        </div>
                      )}
                      {opportunity.remote_work_allowed && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Remote OK
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p>
                </div>

                {/* Requirements */}
                {opportunity.requirements && opportunity.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {opportunity.requirements.map((req: string, index: number) => (
                        <li key={index} className="text-muted-foreground">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {opportunity.benefits && opportunity.benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {opportunity.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="text-muted-foreground">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {opportunity.tags && opportunity.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunity.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className={`text-sm ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {new Date(opportunity.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {(opportunity.salary_min || opportunity.salary_max) && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Salary Range</p>
                      <p className="text-sm text-muted-foreground">
                        {opportunity.salary_currency || 'USD'} {opportunity.salary_min?.toLocaleString()} - {opportunity.salary_max?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Views</p>
                    <p className="text-sm text-muted-foreground">{viewCount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.open(opportunity.source_url, '_blank')}
                  disabled={isExpired}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isExpired ? 'Opportunity Expired' : 'Apply Now'}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  You'll be redirected to the original posting
                </p>

                {/* Quick Share */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2 text-center">Quick Share</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => copyToClipboard(generateShareContent())}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
