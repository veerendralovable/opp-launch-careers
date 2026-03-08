
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase, Calendar, Building, MapPin, ExternalLink } from 'lucide-react';
import SEO from '@/components/SEO';
import LoadingSpinner from '@/components/LoadingSpinner';

const MyApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id, status, applied_at, cover_letter, notes,
          opportunities (id, title, company, location, type, deadline, source_url)
        `)
        .eq('user_id', user!.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load applications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return variants[status] || 'bg-muted text-muted-foreground';
  };

  if (loading) return <LoadingSpinner fullScreen size="lg" message="Loading applications..." />;

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-0">
      <SEO title="My Applications - OpportunityHub" description="Track your job and opportunity applications" />
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
          </div>
          <p className="text-muted-foreground mt-2">Track the status of your applications ({applications.length})</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-24 w-24 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">Start applying to opportunities to track them here.</p>
            <Link to="/opportunities"><Button>Browse Opportunities</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const opp = app.opportunities;
              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusBadge(app.status)}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                          {opp?.type && <Badge variant="outline">{opp.type}</Badge>}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {opp ? (
                            <Link to={`/opportunities/${opp.id}`} className="hover:text-primary transition-colors">
                              {opp.title}
                            </Link>
                          ) : 'Opportunity removed'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                          {opp?.company && (
                            <span className="flex items-center gap-1"><Building className="h-4 w-4" />{opp.company}</span>
                          )}
                          {opp?.location && (
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{opp.location}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                        {app.cover_letter && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{app.cover_letter}</p>
                        )}
                      </div>
                      {opp?.source_url && (
                        <a href={opp.source_url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" /> View Listing
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
