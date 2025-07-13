
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/BackButton';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import { useNotifications } from '@/hooks/useNotifications';
import { User, Loader2 } from 'lucide-react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import LiveNotifications from '@/components/dashboard/LiveNotifications';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';

const UserDashboard = () => {
  const { stats, recentActivity, loading: dashboardLoading, error } = useUserDashboard();
  const { notifications, unreadCount, loading: notificationsLoading } = useNotifications();

  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="hover:scale-105 transition-transform">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <BackButton to="/" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
                  Track your progress and manage your opportunities
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 self-start sm:self-center">
              <User className="h-3 w-3 mr-1" />
              User Account
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Stats Grid */}
        <DashboardStats stats={stats} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Actions */}
          <QuickActions />

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <RecentActivity activities={recentActivity} />

            {/* Live Notifications */}
            <LiveNotifications 
              notifications={notifications}
              unreadCount={unreadCount}
              loading={notificationsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
