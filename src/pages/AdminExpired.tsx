
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import AdminNavigation from '@/components/AdminNavigation';
import { AlertTriangle, Calendar, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

const AdminExpired = () => {
  const [expiredOpportunities, setExpiredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpiredOpportunities();
  }, []);

  const fetchExpiredOpportunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .or('is_expired.eq.true,deadline.lt.' + new Date().toISOString().split('T')[0])
        .order('deadline', { ascending: false });

      if (error) throw error;
      setExpiredOpportunities(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch expired opportunities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Opportunity deleted successfully"
      });
      
      fetchExpiredOpportunities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete opportunity",
        variant: "destructive"
      });
    }
  };

  const markAsExpired = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ is_expired: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Opportunity marked as expired"
      });
      
      fetchExpiredOpportunities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark as expired",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Expired Content Management</h1>
          <p className="text-muted-foreground mt-1">Manage expired opportunities and content</p>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-lg font-semibold">
                {expiredOpportunities.length} Expired Opportunities
              </span>
            </div>
            <Button onClick={fetchExpiredOpportunities} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {expiredOpportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{opportunity.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{opportunity.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                        </div>
                        <Badge variant={opportunity.is_expired ? "destructive" : "secondary"}>
                          {opportunity.is_expired ? "Expired" : "Past Due"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {!opportunity.is_expired && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsExpired(opportunity.id)}
                        >
                          Mark Expired
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteOpportunity(opportunity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {expiredOpportunities.length === 0 && !loading && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Expired Content</h3>
                  <p className="text-gray-500">All opportunities are current and active.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
};

export default AdminExpired;
