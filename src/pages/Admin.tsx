
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import AdminNavigation from '@/components/AdminNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Calendar,
  MapPin,
  Building,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Admin = () => {
  const { 
    pendingOpportunities, 
    loading, 
    error, 
    isModerator, 
    approveOpportunity, 
    rejectOpportunity, 
    deleteOpportunity 
  } = useAdmin();
  
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  if (!isModerator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">Moderator privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading opportunities..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApprove = async (opportunityId: string) => {
    try {
      setActionLoading(opportunityId);
      await approveOpportunity(opportunityId);
      toast({
        title: "Success",
        description: "Opportunity approved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedOpportunity) return;

    try {
      setActionLoading(selectedOpportunity.id);
      await rejectOpportunity(selectedOpportunity.id);
      toast({
        title: "Success",
        description: "Opportunity rejected",
      });
      setShowRejectDialog(false);
      setRejectionReason('');
      setSelectedOpportunity(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      setActionLoading(opportunityId);
      await deleteOpportunity(opportunityId);
      toast({
        title: "Success",
        description: "Opportunity deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internship": return "bg-blue-100 text-blue-800";
      case "Contest": return "bg-green-100 text-green-800";
      case "Event": return "bg-purple-100 text-purple-800";
      case "Scholarship": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Opportunity Management</h1>
          <p className="text-muted-foreground mt-1">Review and moderate submitted opportunities</p>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingOpportunities.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
              <p className="text-gray-600">No opportunities pending review at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingOpportunities.map(opportunity => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getTypeColor(opportunity.type)}>
                          {opportunity.type}
                        </Badge>
                        <Badge variant="outline">{opportunity.domain}</Badge>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{opportunity.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
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
                          Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {opportunity.description}
                  </CardDescription>
                  
                  {opportunity.tags && opportunity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">Source:</span>
                    <a 
                      href={opportunity.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      View Original
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(opportunity.id)}
                      disabled={actionLoading === opportunity.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading === opportunity.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedOpportunity(opportunity);
                        setShowRejectDialog(true);
                      }}
                      disabled={actionLoading === opportunity.id}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(opportunity.id)}
                      disabled={actionLoading === opportunity.id}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Opportunity</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this opportunity.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-20"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReject}
                disabled={!rejectionReason.trim() || actionLoading === selectedOpportunity?.id}
                variant="destructive"
              >
                {actionLoading === selectedOpportunity?.id && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
