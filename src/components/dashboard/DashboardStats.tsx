
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkIcon, Send, Eye, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStatsProps {
  stats: {
    bookmarks: number;
    applications: number;
    views: number;
    profileCompletion: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      {statCards.map((stat, index) => (
        <Link key={index} to={stat.link} className="block group">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <CardContent className="pt-4 md:pt-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 md:p-3 rounded-lg transition-colors duration-300 group-hover:scale-110 ${stat.color}`}>
                  <stat.icon className="h-4 w-4 md:h-6 md:w-6" />
                </div>
                <div className="text-right">
                  <p className="text-xl md:text-2xl font-bold text-gray-900 transition-colors duration-300">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default DashboardStats;
