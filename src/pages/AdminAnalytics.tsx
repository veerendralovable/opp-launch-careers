
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminNavigation from '@/components/AdminNavigation';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Activity, Calendar } from 'lucide-react';

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOpportunities: 0,
    totalApplications: 0,
    activeUsers: 0
  });
  
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [userActivityData, setUserActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch basic stats
      const { data: profiles } = await supabase.from('profiles').select('id, created_at');
      const { data: opportunities } = await supabase.from('opportunities').select('id, created_at');
      const { data: applications } = await supabase.from('applications').select('id, created_at');

      setStats({
        totalUsers: profiles?.length || 0,
        totalOpportunities: opportunities?.length || 0,
        totalApplications: applications?.length || 0,
        activeUsers: profiles?.filter(p => {
          const createdDate = new Date(p.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        }).length || 0
      });

      // Generate monthly data for charts
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const usersThisMonth = profiles?.filter(p => {
          const createdDate = new Date(p.created_at);
          return createdDate.getMonth() === date.getMonth() && 
                 createdDate.getFullYear() === date.getFullYear();
        }).length || 0;

        const opportunitiesThisMonth = opportunities?.filter(o => {
          const createdDate = new Date(o.created_at);
          return createdDate.getMonth() === date.getMonth() && 
                 createdDate.getFullYear() === date.getFullYear();
        }).length || 0;

        last6Months.push({
          month: monthName,
          users: usersThisMonth,
          opportunities: opportunitiesThisMonth
        });
      }
      
      setMonthlyData(last6Months);

      // Generate user activity data
      setUserActivityData([
        { name: 'New Users', value: stats.activeUsers },
        { name: 'Returning Users', value: stats.totalUsers - stats.activeUsers },
        { name: 'Active Applications', value: stats.totalApplications }
      ]);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive platform insights and metrics</p>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Opportunities</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOpportunities}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users (30d)</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8884d8" name="New Users" />
                    <Bar dataKey="opportunities" fill="#82ca9d" name="Opportunities" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userActivityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Platform Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.totalOpportunities > 0 ? (stats.totalApplications / stats.totalOpportunities).toFixed(1) : '0'}
                  </p>
                  <p className="text-sm text-gray-600">Avg. Applications per Opportunity</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : '0'}%
                  </p>
                  <p className="text-sm text-gray-600">User Engagement Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.totalUsers > 0 ? (stats.totalApplications / stats.totalUsers).toFixed(1) : '0'}
                  </p>
                  <p className="text-sm text-gray-600">Applications per User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default AdminAnalytics;
