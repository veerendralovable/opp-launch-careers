
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  BookmarkIcon, 
  Eye, 
  Send, 
  TrendingUp,
  Calendar,
  Target,
  Award,
  User,
  Bell,
  FileText,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { stats, recentActivity, loading: dashboardLoading, error } = useUserDashboard();
  const { notifications, unreadCount, loading: notificationsLoading } = useNotifications();

  const statCards = [
    {
      title: "Saved Opportunities",
      value: stats.bookmarks,
      icon: BookmarkIcon,
      color: "bg-blue-100 text-blue-600",
      link: "/bookmarks"
    },
    {
      title: "Applications Sent",
      value: stats.applications,
      icon: Send,
      color: "bg-green-100 text-green-600",
      link: "/applications"
    },
    {
      title: "Opportunities Viewed",
      value: stats.views,
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
      link: "/opportunities"
    },
    {
      title: "Profile Completion",
      value: `${stats.profileCompletion}%`,
      icon: User,
      color: "bg-orange-100 text-orange-600",
      link: "/profile"
    }
  ];

  const quickActions = [
    {
      title: "Browse Opportunities",
      description: "Find new internships and jobs",
      icon: Target,
      link: "/opportunities",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Scholarships",
      description: "Discover funding opportunities",
      icon: Award,
      link: "/scholarships",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Build Resume",
      description: "Create professional resumes",
      icon: FileText,
      link: "/resume-builder",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Submit Opportunity",
      description: "Share opportunities with others",
      icon: Send,
      link: "/submit",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton to="/" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-gray-600 mt-2">Track your progress and manage your opportunities</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <User className="h-3 w-3 mr-1" />
              User Account
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        {action.title}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity and Notifications */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {activity.type === 'application' && <Send className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'bookmark' && <BookmarkIcon className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'view' && <Eye className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.date}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="bg-red-100 text-red-800 ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notification) => (
                        <div key={notification.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                          notification.is_read ? 'bg-gray-50' : 'bg-blue-50'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            notification.is_read ? 'bg-gray-400' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-gray-500">{notification.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No notifications</p>
                    )}
                    <Link to="/notifications">
                      <Button variant="outline" className="w-full mt-4">
                        View All Notifications
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
