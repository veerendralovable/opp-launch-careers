import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, BarChart3, Shield, Target, Globe, Clock } from 'lucide-react';
import SEO from '@/components/SEO';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';

const Cookies = () => {
  const { resetConsent, preferences, hasConsent } = useCookieConsent();
  const { getSetting } = usePlatformSettings();
  const companyName = getSetting('company_name', 'Rollno31 Edtech Private Limited');
  const privacyEmail = getSetting('privacy_email', '');
  const contactAddress = getSetting('contact_address', '');

  const cookieTypes = [
    { title: "Essential Cookies", icon: Shield, description: "Always active - Required for basic functionality", required: true, retention: "Session to 1 year",
      content: ["Authentication and login state", "Security tokens and CSRF protection", "Session management", "Cookie consent preferences"] },
    { title: "Functional Cookies", icon: Settings, description: "Enhance your experience", required: false, retention: "1 month to 1 year",
      content: ["Language and region preferences", "Theme settings (dark/light mode)", "Form data auto-completion", "Search preferences"] },
    { title: "Analytics Cookies", icon: BarChart3, description: "Help us understand site usage", required: false, retention: "Up to 26 months",
      content: ["Google Analytics (_ga, _gid, _gat)", "Page view and session tracking", "Feature usage and interaction data", "Scroll depth and engagement metrics"] },
    { title: "Advertising Cookies", icon: Target, description: "Used to deliver relevant ads", required: false, retention: "30 days to 2 years",
      content: ["Google AdSense and DART cookies", "Ad personalization based on interests", "Conversion tracking and attribution", "Frequency capping"] }
  ];

  const specificCookies = [
    { name: "cookie_consent", purpose: "Stores your cookie consent decision", type: "Essential", retention: "1 year" },
    { name: "sb-*-auth-token", purpose: "Supabase authentication session", type: "Essential", retention: "Session" },
    { name: "_ga", purpose: "Google Analytics user identification", type: "Analytics", retention: "2 years" },
    { name: "_gid", purpose: "Google Analytics session identification", type: "Analytics", retention: "24 hours" },
    { name: "__gads", purpose: "Google AdSense ad serving", type: "Advertising", retention: "13 months" },
    { name: "DART", purpose: "Google DART cookie for ad targeting", type: "Advertising", retention: "13 months" },
    { name: "IDE", purpose: "DoubleClick ad conversion tracking", type: "Advertising", retention: "13 months" },
  ];

  return (
    <>
      <SEO title="Cookie Policy - OpportunityHub" description="Learn about how OpportunityHub uses cookies. Manage your cookie preferences." />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Cookie className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-xl text-muted-foreground">How we use cookies on OpportunityHub.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: February 2026 | {companyName}</p>
          </div>

          <Card className="mb-8">
            <CardHeader><CardTitle>What Are Cookies?</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files stored on your device when you visit our website. They help us provide 
                a better experience by remembering your preferences and helping us understand how you use our platform.
              </p>
            </CardContent>
          </Card>

          {/* Current Preferences */}
          <Card className="mb-8 border-primary/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Your Current Preferences</CardTitle></CardHeader>
            <CardContent>
              {hasConsent ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {['essential', 'analytics', 'advertising', 'functional'].map(key => (
                      <div key={key} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${(preferences as any)[key] ? 'bg-green-500' : 'bg-muted'}`} />
                        <span className="text-muted-foreground capitalize">{key}: {(preferences as any)[key] ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={resetConsent}>Reset Cookie Preferences</Button>
                </div>
              ) : (
                <p className="text-muted-foreground">You haven't set your cookie preferences yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Cookie Types */}
          <div className="grid gap-6 mb-8">
            {cookieTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg"><type.icon className="h-5 w-5 text-primary" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {type.title}
                        {type.required && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Required</span>}
                      </div>
                      <div className="text-sm text-muted-foreground font-normal">{type.description}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{type.retention}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Specific Cookies Table */}
          <Card className="mb-8">
            <CardHeader><CardTitle>Specific Cookies We Use</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Cookie Name</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Purpose</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Type</th>
                      <th className="text-left py-2 px-2 text-muted-foreground font-medium">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specificCookies.map((cookie, idx) => (
                      <tr key={idx} className="border-b border-border/50">
                        <td className="py-2 px-2 font-mono text-xs text-foreground">{cookie.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{cookie.purpose}</td>
                        <td className="py-2 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            cookie.type === 'Essential' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            cookie.type === 'Analytics' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                          }`}>{cookie.type}</span>
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">{cookie.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Questions About Cookies?</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Company:</strong> {companyName}</p>
                {privacyEmail && <p><strong>Email:</strong> {privacyEmail}</p>}
                {contactAddress && <p><strong>Address:</strong> {contactAddress}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Cookies;
