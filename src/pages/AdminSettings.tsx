
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AdminNavigation from '@/components/AdminNavigation';
import { Settings, Save, Bell, Mail, Shield, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'OpportunityHub',
    siteDescription: 'Connecting talent with opportunities',
    contactEmail: 'contact@opportunityhub.com',
    enableNotifications: true,
    enableEmailNotifications: true,
    requireApproval: true,
    maintenanceMode: false,
    maxApplicationsPerUser: 10,
    autoExpireDays: 30,
    emailSignature: 'Best regards,\nThe OpportunityHub Team'
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save these to your database
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Platform settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Configure platform-wide settings and preferences</p>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableNotifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-600">Allow in-app notifications to users</p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableEmailNotifications">Enable Email Notifications</Label>
                    <p className="text-sm text-gray-600">Send email notifications to users</p>
                  </div>
                  <Switch
                    id="enableEmailNotifications"
                    checked={settings.enableEmailNotifications}
                    onCheckedChange={(checked) => handleInputChange('enableEmailNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Moderation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Content Moderation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireApproval">Require Approval</Label>
                    <p className="text-sm text-gray-600">All opportunities require admin approval before publishing</p>
                  </div>
                  <Switch
                    id="requireApproval"
                    checked={settings.requireApproval}
                    onCheckedChange={(checked) => handleInputChange('requireApproval', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="autoExpireDays">Auto-expire After (Days)</Label>
                  <Input
                    id="autoExpireDays"
                    type="number"
                    value={settings.autoExpireDays}
                    onChange={(e) => handleInputChange('autoExpireDays', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600 mt-1">Opportunities will automatically expire after this many days</p>
                </div>
              </CardContent>
            </Card>

            {/* User Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  User Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxApplicationsPerUser">Max Applications per User</Label>
                  <Input
                    id="maxApplicationsPerUser"
                    type="number"
                    value={settings.maxApplicationsPerUser}
                    onChange={(e) => handleInputChange('maxApplicationsPerUser', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-600 mt-1">Maximum number of applications a user can submit</p>
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="emailSignature">Email Signature</Label>
                  <Textarea
                    id="emailSignature"
                    value={settings.emailSignature}
                    onChange={(e) => handleInputChange('emailSignature', e.target.value)}
                    rows={4}
                    placeholder="Best regards,&#10;The OpportunityHub Team"
                  />
                  <p className="text-sm text-gray-600 mt-1">This signature will be added to all outgoing emails</p>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Maintenance Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode" className="text-red-600">Enable Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">This will make the site inaccessible to regular users</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={loading} size="lg">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AdminSettings;
