
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import BackButton from '@/components/BackButton';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Activity,
  Settings,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    pendingOpportunities: 0,
    approvedOpportunities: 0,
    expiredOpportunities: 0,
    totalNotifications: 0
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch users count
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id');

      // Fetch opportunities stats
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('id, is_approved, is_expired, deadline');

      // Fetch notifications count
      const { data: notifications } = await supabase
        .from('notifications')
        .select('id');

      const total = opportunities?.length || 0;
      const pending = opportunities?.filter(opp => !opp.is_approved).length || 0;
      const approved = opportunities?.filter(opp => opp.is_approved).length || 0;
      const expired = opportunities?.filter(opp => 
        new Date(opp.deadline) < new Date() || opp.is_expired
      ).length || 0;

      setStats({
        totalUsers: profiles?.length || 0,
        totalOpportunities: total,
        pendingOpportunities: pending,
        approvedOpportunities: approved,
        expiredOpportunities: expired,
        totalNotifications: notifications?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user roles and permissions",
      icon: Users,
      link: "/admin/users",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Content Moderation",
      description: "Review and approve opportunities",
      icon: FileText,
      link: "/moderator/pending",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Notifications",
      description: "Send platform notifications",
      icon: Bell,
      link: "/admin/notifications",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Expired Content",
      description: "Manage expired opportunities",
      icon: AlertTriangle,
      link: "/admin/expired",
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Analytics",
      description: "View platform analytics",
      icon: TrendingUp,
      link: "/admin/analytics",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Settings",
      description: "Platform configuration",
      icon: Settings,
      link: "/admin/settings",
      color: "bg-gray-100 text-gray-600"
    }
  ];

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Total Opportunities",
      value: stats.totalOpportunities,
      icon: FileText,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Pending Review",
      value: stats.pendingOpportunities,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Approved",
      value: stats.approvedOpportunities,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Expired",
      value: stats.expiredOpportunities,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Notifications",
      value: stats.totalNotifications,
      icon: Bell,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to="/opportunities" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Platform administration and management</p>
              </div>
            </div>
            <Badge className="bg-red-100 text-red-800">
              <Shield className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <Link to={action.link}>
                  <Button className="w-full">
                    Access {action.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
