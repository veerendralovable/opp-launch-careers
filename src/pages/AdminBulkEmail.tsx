
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AdminNavigation from '@/components/AdminNavigation';
import EmailTemplates from '@/components/admin/EmailTemplates';
import { 
  Send, 
  Users, 
  Mail, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Upload,
  Download
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'opportunity' | 'welcome' | 'reminder' | 'newsletter' | 'custom';
  created_at: string;
}

const AdminBulkEmail = () => {
  const { user, userRole } = useAuth();
  const [recipientType, setRecipientType] = useState('all');
  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    setContent(template.content);
  };

  const handleSendEmail = async () => {
    if (!subject || !content) {
      setSendStatus('error');
      return;
    }

    setSending(true);
    setSendStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('send-gmail-email', {
        body: {
          recipientType,
          customEmails: customEmails.split(',').map(email => email.trim()),
          subject,
          content,
          senderEmail: user?.email
        }
      });

      if (error) throw error;

      setSendStatus('success');
      setSubject('');
      setContent('');
      setCustomEmails('');
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error sending email:', error);
      setSendStatus('error');
    } finally {
      setSending(false);
    }
  };

  const exportUserEmails = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null);

      if (error) throw error;

      const emails = users?.map(user => user.email).join('\n') || '';
      const blob = new Blob([emails], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_emails.txt';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting emails:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Email System</h1>
          <p className="text-gray-600">Send emails to users and manage email templates.</p>
        </div>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose Email</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="analytics">Email Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Compose Email */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Compose Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Recipient Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Recipients</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="all-users"
                            name="recipients"
                            value="all"
                            checked={recipientType === 'all'}
                            onChange={(e) => setRecipientType(e.target.value)}
                          />
                          <label htmlFor="all-users" className="text-sm">All registered users</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="active-users"
                            name="recipients"
                            value="active"
                            checked={recipientType === 'active'}
                            onChange={(e) => setRecipientType(e.target.value)}
                          />
                          <label htmlFor="active-users" className="text-sm">Active users (logged in last 30 days)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="custom-users"
                            name="recipients"
                            value="custom"
                            checked={recipientType === 'custom'}
                            onChange={(e) => setRecipientType(e.target.value)}
                          />
                          <label htmlFor="custom-users" className="text-sm">Custom email list</label>
                        </div>
                      </div>
                    </div>

                    {recipientType === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Email Addresses</label>
                        <Textarea
                          value={customEmails}
                          onChange={(e) => setCustomEmails(e.target.value)}
                          placeholder="Enter email addresses separated by commas"
                          rows={3}
                        />
                      </div>
                    )}

                    {/* Template Selection */}
                    {selectedTemplate && (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Using template: {selectedTemplate.name}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedTemplate(null);
                              setSubject('');
                              setContent('');
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter email subject"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Content</label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter your email content here..."
                        rows={12}
                      />
                    </div>

                    {/* Send Status */}
                    {sendStatus === 'success' && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Email sent successfully!</span>
                      </div>
                    )}

                    {sendStatus === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Failed to send email. Please try again.</span>
                      </div>
                    )}

                    {/* Send Button */}
                    <Button
                      onClick={handleSendEmail}
                      disabled={sending || !subject || !content}
                      className="w-full"
                    >
                      {sending ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={exportUserEmails}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export User Emails
                    </Button>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Email Variables</h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>{{name}} - User's name</div>
                        <div>{{email}} - User's email</div>
                        <div>{{title}} - Opportunity title</div>
                        <div>{{company}} - Company name</div>
                        <div>{{location}} - Location</div>
                        <div>{{deadline}} - Application deadline</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <EmailTemplates onSelectTemplate={handleTemplateSelect} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Email Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,234</div>
                    <div className="text-sm text-gray-600">Total Emails Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-gray-600">Delivery Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">23%</div>
                    <div className="text-sm text-gray-600">Open Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminBulkEmail;
