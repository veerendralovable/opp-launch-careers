import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import ModeratorNavigation from '@/components/ModeratorNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Clock, 
  CheckCircle, 
  X, 
  Eye,
  Calendar,
  MapPin,
  Building2
} from 'lucide-react';

const ModeratorPending = () => {
  const { pendingOpportunities, loading, approveOpportunity, rejectOpportunity } = useAdmin();
  const { toast } = useToast();

  const handleApprove = async (id: string) => {
    const success = await approveOpportunity(id);
    if (success) {
      toast({
        title: "Approved",
        description: "Opportunity has been approved and published.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to approve opportunity.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    const success = await rejectOpportunity(id);
    if (success) {
      toast({
        title: "Rejected",
        description: "Opportunity has been rejected.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to reject opportunity.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading pending content..." />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Pending Review</h1>
              <p className="text-muted-foreground mt-1">Review and moderate submitted content</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <span className="text-sm text-muted-foreground">{pendingOpportunities.length} pending items</span>
            </div>
          </div>
        </div>
      </div>

      <ModeratorNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {pendingOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="border-l-4 border-l-warning">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{opportunity.title}</h3>
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">{opportunity.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {opportunity.company || 'Company not specified'}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {opportunity.location || 'Location not specified'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="outline">{opportunity.type}</Badge>
                      {opportunity.featured && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/opportunities/${opportunity.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(opportunity.id)}
                      className="bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(opportunity.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {pendingOpportunities.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No content pending review at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorPending;
