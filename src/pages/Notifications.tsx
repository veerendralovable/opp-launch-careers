
import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCheck, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, deleteNotification, refetch } = useNotifications();
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');

  if (!user) return <Navigate to="/auth" replace />;

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read);
      for (const n of unread) {
        await supabase.from('notifications').update({ is_read: true }).eq('id', n.id);
      }
      refetch();
      toast({ title: 'All notifications marked as read' });
    } catch {
      toast({ title: 'Error', description: 'Failed to mark all as read', variant: 'destructive' });
    }
  };

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.is_read)
    : filter === 'read'
    ? notifications.filter(n => n.is_read)
    : notifications;

  return (
    <>
      <SEO title="Notifications - OpportunityHub" description="View your notifications and updates." />
      <div className="min-h-screen bg-muted/50">
        <div className="bg-background border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                  <p className="text-muted-foreground text-sm">{unreadCount} unread</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications to show</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map(notification => (
                <Card
                  key={notification.id}
                  className={`transition-colors ${!notification.is_read ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm text-foreground">{notification.title}</p>
                          {!notification.is_read && (
                            <Badge variant="default" className="text-xs px-1.5 py-0">New</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">{notification.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {notification.action_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={notification.action_url}><ExternalLink className="h-4 w-4" /></a>
                          </Button>
                        )}
                        {!notification.is_read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
