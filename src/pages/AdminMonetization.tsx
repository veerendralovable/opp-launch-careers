
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminNavigation from '@/components/AdminNavigation';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';

const AdminMonetization = () => {
  // Mock data for monetization metrics
  const metrics = {
    totalRevenue: 0,
    monthlyRevenue: 0,
    premiumUsers: 0,
    conversionRate: 0
  };

  const revenueStreams = [
    {
      name: "Premium Subscriptions",
      revenue: 0,
      users: 0,
      status: "Coming Soon"
    },
    {
      name: "Featured Listings",
      revenue: 0,
      listings: 0,
      status: "Coming Soon"
    },
    {
      name: "Job Board Partnerships",
      revenue: 0,
      partners: 0,
      status: "Coming Soon"
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Monetization Dashboard</h1>
          <p className="text-muted-foreground mt-1">Revenue metrics and monetization strategies</p>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.monthlyRevenue}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">Active subscribers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">Free to premium</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Streams */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{stream.name}</h3>
                    <p className="text-sm text-gray-600">
                      Revenue: ${stream.revenue} | {stream.users ? `Users: ${stream.users}` : `Items: ${stream.listings || stream.partners}`}
                    </p>
                  </div>
                  <Badge variant="secondary">{stream.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monetization Strategy */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Monetization Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h3>Planned Revenue Streams:</h3>
              <ul>
                <li><strong>Premium Subscriptions:</strong> Advanced features for power users</li>
                <li><strong>Featured Listings:</strong> Highlighted opportunity placements</li>
                <li><strong>Corporate Partnerships:</strong> Direct integrations with company job boards</li>
                <li><strong>Resume Services:</strong> Premium AI resume optimization</li>
                <li><strong>Career Coaching:</strong> One-on-one mentorship programs</li>
              </ul>
              
              <h3>Implementation Timeline:</h3>
              <ul>
                <li>Q1 2024: Premium subscriptions launch</li>
                <li>Q2 2024: Featured listings for opportunities</li>
                <li>Q3 2024: Corporate partnership program</li>
                <li>Q4 2024: Advanced career services</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMonetization;
