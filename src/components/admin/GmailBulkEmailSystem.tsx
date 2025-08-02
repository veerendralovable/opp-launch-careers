

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Users, 
  Send, 
  Settings, 
  Eye, 
  Link,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { sendEmail, validateEmailConfig, createEmailTemplate } from '@/utils/emailService';

interface Recipient {
  id: string;
  name: string;
  email: string;
}

const GmailBulkEmailSystem = () => {
  const [emailConfig, setEmailConfig] = useState({
    service: 'gmail' as const,
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      user: '',
      password: ''
    }
  });

  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    recipientType: 'all',
    maxRecipients: 100,
    trackLinks: true
  });

  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [sending, setSending] = useState(false);
  const [configValid, setConfigValid] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setConfigValid(validateEmailConfig(emailConfig));
  }, [emailConfig]);

  useEffect(() => {
    fetchRecipients();
  }, [emailData.recipientType, emailData.maxRecipients]);

  const fetchRecipients = async () => {
    try {
      let query = supabase.from('profiles').select('id, name, email');

      if (emailData.recipientType === 'role_based') {
        query = query.limit(emailData.maxRecipients);
      } else {
        query = query.limit(emailData.maxRecipients);
      }

      const { data, error } = await query;
      if (error) throw error;

      const typedData: Recipient[] = (data || []).map((item: any) => ({
        id: item.id || '',
        name: item.name || 'No Name',
        email: item.email || ''
      }));

      setRecipients(typedData);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recipients",
        variant: "destructive"
      });
    }
  };

  const handleSendEmails = async () => {
    if (!configValid) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your Gmail SMTP settings",
        variant: "destructive"
      });
      return;
    }

    if (!emailData.subject || !emailData.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both subject and content",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const batchSize = 10;
      const delay = 2000;

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        try {
          const emailPromises = batch.map(async (recipient: Recipient) => {
            const unsubscribeUrl = `${window.location.origin}/unsubscribe?user=${recipient.id}`;
            const emailHtml = createEmailTemplate(
              emailData.content.replace(/{{name}}/g, recipient.name || 'User'),
              recipient.name || 'User',
              unsubscribeUrl
            );

            return sendEmail({
              to: [recipient.email],
              subject: emailData.subject,
              html: emailHtml,
              trackLinks: emailData.trackLinks
            }, emailConfig);
          });

          await Promise.allSettled(emailPromises);
          successCount += batch.length;

          toast({
            title: "Sending Progress",
            description: `Sent ${Math.min(i + batchSize, recipients.length)} of ${recipients.length} emails`
          });

          if (i + batchSize < recipients.length) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }

        } catch (batchError) {
          console.error('Batch send error:', batchError);
          errorCount += batch.length;
        }
      }

      toast({
        title: "Email Campaign Complete",
        description: `Successfully sent ${successCount} emails${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      });

    } catch (error: any) {
      console.error('Error sending emails:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send emails",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const previewEmail = () => {
    const unsubscribeUrl = `${window.location.origin}/unsubscribe?user=preview`;
    const previewHtml = createEmailTemplate(
      emailData.content.replace(/{{name}}/g, 'John Doe'),
      'John Doe',
      unsubscribeUrl
    );
    
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHtml);
      previewWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Gmail Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gmail SMTP Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gmailUser">Gmail Address</Label>
              <Input
                id="gmailUser"
                type="email"
                placeholder="your-email@gmail.com"
                value={emailConfig.smtp.user}
                onChange={(e) => setEmailConfig(prev => ({
                  ...prev,
                  smtp: { ...prev.smtp, user: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="gmailPassword">App Password</Label>
              <Input
                id="gmailPassword"
                type="password"
                placeholder="xxxx xxxx xxxx xxxx"
                value={emailConfig.smtp.password}
                onChange={(e) => setEmailConfig(prev => ({
                  ...prev,
                  smtp: { ...prev.smtp, password: e.target.value }
                }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use an App Password, not your regular Gmail password. 
                <a href="https://support.google.com/accounts/answer/185833" target="_blank" className="text-blue-600 hover:underline ml-1">
                  Learn how to create one
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {configValid ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configuration Valid
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Configuration Incomplete
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Composition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="content">Email Content</Label>
            <Textarea
              id="content"
              rows={8}
              placeholder="Enter your email content here. Use {{name}} for personalization."
              value={emailData.content}
              onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use {{name}} to personalize emails with recipient names
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="trackLinks"
                checked={emailData.trackLinks}
                onCheckedChange={(checked) => setEmailData(prev => ({ ...prev, trackLinks: checked }))}
              />
              <Label htmlFor="trackLinks" className="flex items-center gap-1">
                <Link className="h-4 w-4" />
                Track Links
              </Label>
            </div>
            
            <Button variant="outline" onClick={previewEmail}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recipients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recipients ({recipients.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientType">Recipient Type</Label>
              <Select
                value={emailData.recipientType}
                onValueChange={(value) => setEmailData(prev => ({ ...prev, recipientType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users (30 days)</SelectItem>
                  <SelectItem value="role_based">Role-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxRecipients">Max Recipients</Label>
              <Input
                id="maxRecipients"
                type="number"
                min="1"
                max="500"
                value={emailData.maxRecipients}
                onChange={(e) => setEmailData(prev => ({ ...prev, maxRecipients: parseInt(e.target.value) }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Gmail limit: 500 emails/day for free accounts
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Preview Recipients:</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {recipients.slice(0, 10).map((recipient: Recipient) => (
                <div key={recipient.id} className="text-sm text-gray-600">
                  {recipient.name} - {recipient.email}
                </div>
              ))}
              {recipients.length > 10 && (
                <p className="text-xs text-gray-500 mt-2">
                  ... and {recipients.length - 10} more recipients
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Ready to send?</p>
              <p className="text-sm text-gray-600">
                This will send {recipients.length} emails via Gmail SMTP
              </p>
            </div>
            
            <Button 
              onClick={handleSendEmails}
              disabled={!configValid || sending || recipients.length === 0}
              size="lg"
              className="min-w-[120px]"
            >
              {sending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Emails
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GmailBulkEmailSystem;

