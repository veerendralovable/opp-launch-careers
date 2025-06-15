
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/useAdmin';
import { useModeratorAccess } from '@/hooks/useModeratorAccess';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Eye
} from 'lucide-react';

const ModeratorDashboard = () => {
  const { allOpportunities, pendingOpportunities } = useAdmin();
  const { hasModeratorAccess } = useModeratorAccess();

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

  const stats = [
    {
      title: "Pending Review",
      value: pendingOpportunities.length,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Total Opportunities",
      value: allOpportunities.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Approved Today",
      value: todayOpportunities.length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Total Approved",
      value: approvedOpportunities.length,
      icon: Eye,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
          <p className="text-gray-600 mt-2">Content moderation and opportunity management</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Opportunities for Review */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Opportunities for Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOpportunities.slice(0, 5).map(opportunity => (
                <div key={opportunity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{opportunity.title}</p>
                    <p className="text-xs text-gray-500">{opportunity.type} • {opportunity.domain}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted: {new Date(opportunity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              ))}
              {pendingOpportunities.length === 0 && (
                <p className="text-gray-500 text-center py-4">No opportunities pending review</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
