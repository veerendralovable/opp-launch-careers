import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import AdminNavigation from '@/components/AdminNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  BarChart3, 
  Users, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Settings,
  DollarSign,
  TrendingUp,
  Bookmark,
  Archive,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const { stats, loading, refetch } = useAdminStats();
  const { user } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge className="bg-destructive/10 text-destructive border-destructive/20">Admin</Badge>
            </div>
          </div>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Opportunities</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalOpportunities}</div>
              <p className="text-xs text-muted-foreground">{stats.approvedOpportunities} approved</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.pendingOpportunities}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bookmarks</CardTitle>
              <Bookmark className="h-4 w-4 text-secondary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalBookmarks}</div>
              <p className="text-xs text-muted-foreground">User bookmarks</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-primary" />
                Review Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {stats.pendingOpportunities} opportunities pending review
              </p>
              <Link to="/admin/opportunities">
                <Button className="w-full" size="sm">Review Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage user accounts and permissions
              </p>
              <Link to="/admin/users">
                <Button className="w-full" size="sm" variant="outline">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-5 w-5 text-primary" />
                Email Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Send bulk emails to users
              </p>
              <Link to="/admin/email">
                <Button className="w-full" size="sm" variant="outline">Send Emails</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View platform analytics and insights
              </p>
              <Link to="/admin/analytics">
                <Button className="w-full" size="sm" variant="outline">View Analytics</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Archive className="h-5 w-5 text-primary" />
                Expired Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {stats.expiredOpportunities} expired opportunities
              </p>
              <Link to="/admin/expired">
                <Button className="w-full" size="sm" variant="outline">View Expired</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5 text-primary" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure platform settings
              </p>
              <Link to="/admin/settings">
                <Button className="w-full" size="sm" variant="outline">Manage Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {stats.recentOpportunities.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Opportunities</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {stats.recentOpportunities.map((opp) => (
                    <div key={opp.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-foreground">{opp.title}</p>
                        <p className="text-sm text-muted-foreground">{opp.company || opp.type}</p>
                      </div>
                      <Badge variant={opp.is_approved ? "default" : "secondary"}>
                        {opp.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
