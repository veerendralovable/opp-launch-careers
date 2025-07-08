
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { Bell, Check, CheckCheck, X } from 'lucide-react';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtimeNotifications();

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleNotifications}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 z-50 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                        if (notification.action_url) {
                          window.open(notification.action_url, '_blank');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
