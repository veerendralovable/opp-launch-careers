
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import SEO from '@/components/SEO';

const Contact = () => {
  const { getSetting } = usePlatformSettings();
  const contactEmail = getSetting('contact_email', '');
  const contactPhone = getSetting('contact_phone', '');
  const contactAddress = getSetting('contact_address', '');
  const businessHours = getSetting('business_hours', 'Mon-Fri: 9AM-6PM IST');

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', category: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <SEO 
        title="Contact Us - OpportunityHub"
        description="Get in touch with OpportunityHub. We're here to help with questions, feedback, and support."
      />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">We'd love to hear from you. Send us a message and we'll respond ASAP.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><Label htmlFor="name">Name</Label><Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} required /></div>
                      <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} required /></div>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={formData.category} onValueChange={v => handleChange('category', v)}>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="business">Business Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label htmlFor="subject">Subject</Label><Input id="subject" value={formData.subject} onChange={e => handleChange('subject', e.target.value)} required /></div>
                    <div><Label htmlFor="message">Message</Label><Textarea id="message" rows={6} value={formData.message} onChange={e => handleChange('message', e.target.value)} required /></div>
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Get in touch</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div><p className="font-medium text-foreground">Email</p><p className="text-sm text-muted-foreground">{contactEmail}</p></div>
                    </div>
                  )}
                  {contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div><p className="font-medium text-foreground">Phone</p><p className="text-sm text-muted-foreground">{contactPhone}</p></div>
                    </div>
                  )}
                  {contactAddress && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div><p className="font-medium text-foreground">Address</p><p className="text-sm text-muted-foreground">{contactAddress}</p></div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div><p className="font-medium text-foreground">Business Hours</p><p className="text-sm text-muted-foreground">{businessHours}</p></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
