
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  CheckCircle, 
  X, 
  Eye,
  Calendar,
  MapPin,
  Building2,
  Loader2
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
    const success = await rejectOpportunity(id, "Does not meet content guidelines");
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pending content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pending Review</h1>
              <p className="text-gray-600 mt-2">Review and moderate submitted content</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-sm text-gray-600">{pendingOpportunities.length} pending items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {pendingOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="border-l-4 border-l-amber-400">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{opportunity.title}</h3>
                      <Badge className="bg-amber-100 text-amber-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{opportunity.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
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
                        <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/opportunities/${opportunity.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(opportunity.id)}
                      className="bg-green-600 hover:bg-green-700"
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
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No content pending review at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorPending;
