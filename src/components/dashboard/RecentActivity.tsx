
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Send, BookmarkIcon, Eye } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'application' | 'bookmark' | 'view';
  title: string;
  date: string;
  status: string;
  opportunity_id?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Send className="h-4 w-4 text-blue-600" />;
      case 'bookmark':
        return <BookmarkIcon className="h-4 w-4 text-blue-600" />;
      case 'view':
        return <Eye className="h-4 w-4 text-blue-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {activities.length > 0 ? (
            activities.slice(0, 5).map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 pb-3 md:pb-4 border-b last:border-b-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-all duration-200"
              >
                <div className="p-2 bg-blue-100 rounded-lg transition-transform duration-200 hover:scale-110">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 md:py-8">
              <TrendingUp className="h-8 w-8 md:h-12 md:w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm md:text-base text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
