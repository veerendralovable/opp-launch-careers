
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { useModeratorAccess } from '@/hooks/useModeratorAccess';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Eye,
  Shield,
  Activity,
  TrendingUp
} from 'lucide-react';

const ModeratorDashboard = () => {
  const { allOpportunities, pendingOpportunities, refetch } = useAdmin();
  const { hasModeratorAccess, isModerator, isAdmin } = useModeratorAccess();
  const [moderationStats, setModerationStats] = useState({
    approvedToday: 0,
    rejectedToday: 0,
    pendingReview: 0
  });

  useEffect(() => {
    if (hasModeratorAccess) {
      fetchModerationStats();
      setupRealTimeUpdates();
    }
  }, [hasModeratorAccess]);

  const fetchModerationStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const approvedToday = allOpportunities.filter(opp => 
        opp.is_approved && 
        opp.approved_at && 
        new Date(opp.approved_at) >= today
      ).length;

      const rejectedToday = allOpportunities.filter(opp => 
        !opp.is_approved && 
        opp.rejection_reason &&
        new Date(opp.updated_at) >= today
      ).length;

      setModerationStats({
        approvedToday,
        rejectedToday,
        pendingReview: pendingOpportunities.length
      });
    } catch (error) {
      console.error('Error fetching moderation stats:', error);
    }
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('moderator-opportunities-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
        },
        (payload) => {
          console.log('Real-time moderation update:', payload);
          refetch();
          fetchModerationStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (!hasModeratorAccess) {
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

  const approvedOpportunities = allOpportunities.filter(opp => opp.is_approved);
  const todayOpportunities = allOpportunities.filter(opp => {
    const today = new Date().toDateString();
    return new Date(opp.created_at).toDateString() === today;
  });

  const urgentItems = pendingOpportunities.filter(opp => {
    const deadline = new Date(opp.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7; // Urgent if deadline is within 7 days
  });

  const stats = [
    {
      title: "Pending Review",
      value: pendingOpportunities.length,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
      trend: `${urgentItems.length} urgent`,
      urgent: urgentItems.length > 0
    },
    {
      title: "Approved Today",
      value: moderationStats.approvedToday,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      trend: "Keep up the good work!"
    },
    {
      title: "Total Opportunities",
      value: allOpportunities.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      trend: `${todayOpportunities.length} submitted today`
    },
    {
      title: "Approval Rate",
      value: `${allOpportunities.length > 0 ? Math.round((approvedOpportunities.length / allOpportunities.length) * 100) : 0}%`,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      trend: "Overall platform health"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
              <p className="text-gray-600 mt-2">Content moderation and real-time opportunity management</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={isAdmin ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                <Shield className="h-3 w-3 mr-1" />
                {isAdmin ? 'Admin' : 'Moderator'} Access
              </Badge>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${stat.urgent ? 'ring-2 ring-yellow-400' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className={`text-xs ${stat.urgent ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}>
                      {stat.trend}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Urgent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Moderation Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Moderation Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Review Pending Items ({pendingOpportunities.length})
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Urgent Reviews ({urgentItems.length})
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  View Approved Content ({approvedOpportunities.length})
                </Button>
                {isAdmin && (
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Manage User Roles
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Urgent Items Requiring Attention */}
          <Card className={urgentItems.length > 0 ? 'ring-2 ring-yellow-400' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Urgent Items ({urgentItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {urgentItems.length > 0 ? (
                  urgentItems.slice(0, 5).map(opportunity => {
                    const deadline = new Date(opportunity.deadline);
                    const now = new Date();
                    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={opportunity.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="font-medium text-sm truncate">{opportunity.title}</p>
                        <p className="text-xs text-gray-600">{opportunity.type} • {opportunity.domain}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {daysLeft} days left
                          </Badge>
                          <p className="text-xs text-gray-500">
                            {new Date(opportunity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No urgent items!</p>
                    <p className="text-xs text-gray-500">All deadlines are manageable</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Stream */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Moderation Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allOpportunities.slice(0, 10).map(opportunity => (
                <div key={opportunity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">{opportunity.title}</p>
                    <p className="text-xs text-gray-500">{opportunity.type} • {opportunity.domain}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted: {new Date(opportunity.created_at).toLocaleDateString()}
                      {opportunity.approved_at && ` • Approved: ${new Date(opportunity.approved_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={opportunity.is_approved ? "default" : "secondary"}>
                      {opportunity.is_approved ? "Approved" : "Pending"}
                    </Badge>
                    {urgentItems.some(urgent => urgent.id === opportunity.id) && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {allOpportunities.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No opportunities yet</p>
                  <p className="text-sm text-gray-400">Content will appear here as it's submitted</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
