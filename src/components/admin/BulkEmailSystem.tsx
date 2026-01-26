import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Send, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';

interface EmailNotification {
  id: string;
  subject: string;
  content: string;
  target_audience: string;
  status: string;
  sent_count: number;
  created_at: string;
  sent_at: string | null;
}

const BulkEmailSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newEmail, setNewEmail] = useState({
    subject: '',
    content: '',
    target_audience: 'all'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEmailNotifications();
  }, []);

  const fetchEmailNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching email notifications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBulkNotification = async () => {
    if (!newEmail.subject.trim() || !newEmail.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setSending(true);

      // Use send_bulk_notification function to create notifications
      const { data, error } = await supabase.rpc('send_bulk_notification', {
        _title: newEmail.subject,
        _message: newEmail.content,
        _type: 'info',
        _target_role: newEmail.target_audience === 'all' ? null : newEmail.target_audience as any
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Notification sent to ${data} users`,
      });

      // Reset form
      setNewEmail({
        subject: '',
        content: '',
        target_audience: 'all'
      });

      // Refresh the list
      fetchEmailNotifications();

    } catch (error: any) {
      console.error('Error creating bulk notification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create bulk notification",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sending':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      sending: 'bg-blue-100 text-blue-800',
      sent: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[status] || colors.draft}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Create New Email Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Create Bulk Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject / Title</Label>
            <Input
              id="subject"
              value={newEmail.subject}
              onChange={(e) => setNewEmail(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter notification title"
              disabled={sending}
            />
          </div>

          <div>
            <Label htmlFor="content">Message Content</Label>
            <Textarea
              id="content"
              value={newEmail.content}
              onChange={(e) => setNewEmail(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your message here..."
              rows={6}
              disabled={sending}
            />
          </div>

          <div>
            <Label htmlFor="target_audience">Recipients</Label>
            <Select
              value={newEmail.target_audience}
              onValueChange={(value) => setNewEmail(prev => ({ ...prev, target_audience: value }))}
              disabled={sending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="user">Regular Users Only</SelectItem>
                <SelectItem value="admin">Admins Only</SelectItem>
                <SelectItem value="moderator">Moderators Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={createBulkNotification}
            disabled={sending || !newEmail.subject.trim() || !newEmail.content.trim()}
            className="w-full"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Notification...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Bulk Notification
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Notification History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications sent yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(notification.status)}
                        <h3 className="font-medium">{notification.subject}</h3>
                        {getStatusBadge(notification.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Target: {notification.target_audience || 'All Users'}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created {new Date(notification.created_at).toLocaleDateString()}
                        </div>

                        {notification.sent_count > 0 && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Sent to {notification.sent_count} users
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> This system sends in-app notifications to users. 
          For email delivery, additional email service integration is required.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default BulkEmailSystem;
