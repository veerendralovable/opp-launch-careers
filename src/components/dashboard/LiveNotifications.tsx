
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface LiveNotificationsProps {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
}

const LiveNotifications: React.FC<LiveNotificationsProps> = ({ 
  notifications, 
  unreadCount, 
  loading 
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800 animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6 md:py-8">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                    notification.is_read ? 'bg-gray-50' : 'bg-blue-50 animate-pulse'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    notification.is_read ? 'bg-gray-400' : 'bg-blue-500 animate-bounce'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                    <p className="text-xs text-gray-500 truncate">{notification.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 md:py-8">
                <Bell className="h-8 w-8 md:h-12 md:w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm md:text-base text-gray-500">No notifications</p>
              </div>
            )}
            <Link to="/notifications">
              <Button variant="outline" className="w-full mt-4 transition-all duration-300 hover:scale-105">
                View All Notifications
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveNotifications;
