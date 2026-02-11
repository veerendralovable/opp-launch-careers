
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import AdminNavigation from '@/components/AdminNavigation';
import { Settings, Save, Bell, Mail, Shield, Globe, Share2, Loader2 } from 'lucide-react';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { settings, loading: settingsLoading, updateSetting, refetch } = usePlatformSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    site_name: '',
    site_description: '',
    company_name: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    privacy_email: '',
    legal_email: '',
    business_hours: '',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: '',
    adsense_publisher_id: '',
    ga_measurement_id: '',
  });

  useEffect(() => {
    if (!settingsLoading && Object.keys(settings).length > 0) {
      setForm({
        site_name: settings.site_name || '',
        site_description: settings.site_description || '',
        company_name: settings.company_name || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
        privacy_email: settings.privacy_email || '',
        legal_email: settings.legal_email || '',
        business_hours: settings.business_hours || '',
        social_facebook: settings.social_facebook || '',
        social_twitter: settings.social_twitter || '',
        social_instagram: settings.social_instagram || '',
        social_linkedin: settings.social_linkedin || '',
        adsense_publisher_id: settings.adsense_publisher_id || '',
        ga_measurement_id: settings.ga_measurement_id || '',
      });
    }
  }, [settings, settingsLoading]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(form)) {
        if (settings[key] !== value) {
          await updateSetting(key, value);
        }
      }
      toast({ title: "All Settings Saved", description: "Platform settings updated successfully." });
      refetch();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Configure platform-wide settings — changes apply globally in real-time</p>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Name</Label>
              <Input value={form.site_name} onChange={e => handleChange('site_name', e.target.value)} />
            </div>
            <div>
              <Label>Site Description</Label>
              <Textarea value={form.site_description} onChange={e => handleChange('site_description', e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Parent Company Name</Label>
              <Input value={form.company_name} onChange={e => handleChange('company_name', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Contact Email</Label>
              <Input type="email" value={form.contact_email} onChange={e => handleChange('contact_email', e.target.value)} placeholder="support@yourdomain.com" />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input value={form.contact_phone} onChange={e => handleChange('contact_phone', e.target.value)} placeholder="+91-XXXXXXXXXX" />
            </div>
            <div>
              <Label>Office Address</Label>
              <Textarea value={form.contact_address} onChange={e => handleChange('contact_address', e.target.value)} rows={2} placeholder="Full office address" />
            </div>
            <div>
              <Label>Privacy/DPO Email</Label>
              <Input type="email" value={form.privacy_email} onChange={e => handleChange('privacy_email', e.target.value)} />
            </div>
            <div>
              <Label>Legal Email</Label>
              <Input type="email" value={form.legal_email} onChange={e => handleChange('legal_email', e.target.value)} />
            </div>
            <div>
              <Label>Business Hours</Label>
              <Input value={form.business_hours} onChange={e => handleChange('business_hours', e.target.value)} placeholder="Mon-Fri: 9AM-6PM IST" />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" /> Social Media Links</CardTitle>
            <p className="text-sm text-muted-foreground">Leave empty to hide the icon from the footer</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Facebook URL</Label>
              <Input value={form.social_facebook} onChange={e => handleChange('social_facebook', e.target.value)} placeholder="https://facebook.com/yourpage" />
            </div>
            <div>
              <Label>Twitter/X URL</Label>
              <Input value={form.social_twitter} onChange={e => handleChange('social_twitter', e.target.value)} placeholder="https://twitter.com/yourhandle" />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input value={form.social_instagram} onChange={e => handleChange('social_instagram', e.target.value)} placeholder="https://instagram.com/yourprofile" />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input value={form.social_linkedin} onChange={e => handleChange('social_linkedin', e.target.value)} placeholder="https://linkedin.com/company/yourcompany" />
            </div>
          </CardContent>
        </Card>

        {/* AdSense & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Ads & Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Google AdSense Publisher ID</Label>
              <Input value={form.adsense_publisher_id} onChange={e => handleChange('adsense_publisher_id', e.target.value)} placeholder="pub-XXXXXXXXXXXXXXXX" />
              <p className="text-xs text-muted-foreground mt-1">Enter your publisher ID after AdSense approval</p>
            </div>
            <div>
              <Label>Google Analytics Measurement ID</Label>
              <Input value={form.ga_measurement_id} onChange={e => handleChange('ga_measurement_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
            </div>
          </CardContent>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
