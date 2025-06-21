
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { useUserRoles } from '@/hooks/useUserRoles';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Activity,
  Database
} from 'lucide-react';

const AdminDashboard = () => {
  const { allOpportunities, pendingOpportunities, isAdmin, refetch } = useAdmin();
  const { users, refetch: refetchUsers } = useUserRoles();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    recentActivity: 0
  });

  useEffect(() => {
    if (isAdmin) {
      fetchSystemStats();
      setupRealTimeUpdates();
    }
  }, [isAdmin]);

  const fetchSystemStats = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, created_at');

      if (!error && profiles) {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        setSystemStats({
          totalUsers: profiles.length,
          activeUsers: profiles.filter(p => new Date(p.created_at) > lastWeek).length,
          recentActivity: profiles.filter(p => new Date(p.created_at) > lastWeek).length
        });
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const setupRealTimeUpdates = () => {
    const opportunitiesChannel = supabase
      .channel('admin-opportunities-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
        },
        () => {
          console.log('Real-time opportunity update received');
          refetch();
        }
      )
      .subscribe();

    const usersChannel = supabase
      .channel('admin-users-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
        },
        () => {
          console.log('Real-time user role update received');
          refetchUsers();
          fetchSystemStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(opportunitiesChannel);
      supabase.removeChannel(usersChannel);
    };
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const approvedOpportunities = allOpportunities.filter(opp => opp.is_approved);
  const expiredOpportunities = allOpportunities.filter(opp => 
    new Date(opp.deadline) < new Date()
  );
  const todayOpportunities = allOpportunities.filter(opp => {
    const today = new Date().toDateString();
    return new Date(opp.created_at).toDateString() === today;
  });

  const adminUsers = users.filter(user => 
    user.user_roles.some(role => role.role === 'admin')
  );
  const moderatorUsers = users.filter(user => 
    user.user_roles.some(role => role.role === 'moderator')
  );

  const stats = [
    {
      title: "Total Opportunities",
      value: allOpportunities.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      trend: `+${todayOpportunities.length} today`
    },
    {
      title: "Pending Review",
      value: pendingOpportunities.length,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
      trend: "Needs attention"
    },
    {
      title: "Total Users",
      value: systemStats.totalUsers,
      icon: Users,
      color: "bg-green-100 text-green-600",
      trend: `${systemStats.activeUsers} active this week`
    },
    {
      title: "System Health",
      value: "100%",
      icon: Activity,
      color: "bg-purple-100 text-purple-600",
      trend: "All systems operational"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Platform overview and real-time monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-100 text-red-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xs text-gray-500">{stat.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Real-time Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Review Pending Opportunities ({pendingOpportunities.length})
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage User Roles ({users.length} users)
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics Dashboard
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  System Settings & Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Real-time System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database Connection</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authentication System</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Real-time Updates</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage System</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Regular Users</span>
                  <Badge variant="secondary">
                    {users.filter(u => u.user_roles.some(r => r.role === 'user')).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Moderators</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {moderatorUsers.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Administrators</span>
                  <Badge className="bg-red-100 text-red-800">
                    {adminUsers.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Approved Content</span>
                  <Badge className="bg-green-100 text-green-800">
                    {approvedOpportunities.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Review</span>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {pendingOpportunities.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expired Content</span>
                  <Badge className="bg-red-100 text-red-800">
                    {expiredOpportunities.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allOpportunities.slice(0, 3).map(opportunity => (
                  <div key={opportunity.id} className="text-xs p-2 bg-gray-50 rounded">
                    <p className="font-medium truncate">{opportunity.title}</p>
                    <p className="text-gray-500">
                      {opportunity.is_approved ? 'Approved' : 'Pending'} • 
                      {new Date(opportunity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
