
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, BarChart3, Shield, Target, Globe, Clock } from 'lucide-react';
import SEO from '@/components/SEO';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const Cookies = () => {
  const { resetConsent, preferences, hasConsent } = useCookieConsent();

  const cookieTypes = [
    {
      title: "Essential Cookies",
      icon: Shield,
      description: "Always active - Required for basic functionality",
      required: true,
      retention: "Session to 1 year",
      content: [
        "Authentication and login state (sb-*, PKCE verifier)",
        "Security tokens and CSRF protection",
        "Session management and user identification",
        "Load balancing and server routing",
        "Cookie consent preferences"
      ]
    },
    {
      title: "Functional Cookies",
      icon: Settings,
      description: "Enhance your experience with personalized features",
      required: false,
      retention: "1 month to 1 year",
      content: [
        "Language and region preferences",
        "Theme settings (dark/light mode)",
        "Form data auto-completion",
        "Recently viewed opportunities",
        "Search preferences and filters"
      ]
    },
    {
      title: "Analytics Cookies",
      icon: BarChart3,
      description: "Help us understand how visitors use our platform",
      required: false,
      retention: "Up to 26 months",
      content: [
        "Google Analytics (_ga, _gid, _gat)",
        "Page view and session tracking",
        "Feature usage and interaction data",
        "Performance and error monitoring",
        "Scroll depth and engagement metrics"
      ]
    },
    {
      title: "Advertising Cookies",
      icon: Target,
      description: "Used to deliver relevant advertisements",
      required: false,
      retention: "30 days to 2 years",
      content: [
        "Google AdSense and DoubleClick cookies",
        "Ad personalization based on interests",
        "Conversion tracking and attribution",
        "Frequency capping (limit ad displays)",
        "Cross-site tracking for remarketing"
      ]
    }
  ];

  const specificCookies = [
    { name: "cookie_consent", purpose: "Stores your cookie consent decision", type: "Essential", retention: "1 year" },
    { name: "cookie_preferences", purpose: "Stores your granular cookie preferences", type: "Essential", retention: "1 year" },
    { name: "sb-*-auth-token", purpose: "Supabase authentication session", type: "Essential", retention: "Session" },
    { name: "_ga", purpose: "Google Analytics user identification", type: "Analytics", retention: "2 years" },
    { name: "_gid", purpose: "Google Analytics session identification", type: "Analytics", retention: "24 hours" },
    { name: "_gat", purpose: "Google Analytics rate limiting", type: "Analytics", retention: "1 minute" },
    { name: "__gads", purpose: "Google AdSense ad serving", type: "Advertising", retention: "13 months" },
    { name: "__gpi", purpose: "Google Publisher ID tracking", type: "Advertising", retention: "13 months" },
    { name: "IDE", purpose: "DoubleClick ad conversion tracking", type: "Advertising", retention: "13 months" },
    { name: "NID", purpose: "Google ad personalization", type: "Advertising", retention: "6 months" },
  ];

  return (
    <>
      <SEO 
        title="Cookie Policy - OpportunityHub"
        description="Learn about how OpportunityHub uses cookies and similar technologies. Manage your cookie preferences and understand your choices."
      />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Cookie className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-xl text-muted-foreground">How we use cookies to improve your experience on OpportunityHub.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: February 2025</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, keeping you 
                logged in, and helping us understand how you use our platform. Some cookies are essential for 
                the site to function, while others help us improve our service or deliver relevant advertisements.
              </p>
            </CardContent>
          </Card>

          {/* Current Preferences Status */}
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Your Current Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasConsent ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${preferences.essential ? 'bg-green-500' : 'bg-muted'}`} />
                      <span className="text-muted-foreground">Essential: Always enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${preferences.analytics ? 'bg-green-500' : 'bg-muted'}`} />
                      <span className="text-muted-foreground">Analytics: {preferences.analytics ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${preferences.advertising ? 'bg-green-500' : 'bg-muted'}`} />
                      <span className="text-muted-foreground">Advertising: {preferences.advertising ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${preferences.functional ? 'bg-green-500' : 'bg-muted'}`} />
                      <span className="text-muted-foreground">Functional: {preferences.functional ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={resetConsent}>
                    Reset Cookie Preferences
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You haven't set your cookie preferences yet. A cookie consent banner will appear when you visit the site.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 mb-8">
            {cookieTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <type.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {type.title}
                        {type.required && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Required</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground font-normal">{type.description}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {type.retention}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
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
            <CardHeader>
              <CardTitle>Specific Cookies We Use</CardTitle>
            </CardHeader>
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
                          }`}>
                            {cookie.type}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-muted-foreground">{cookie.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-Party Cookies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We partner with third-party services that may set their own cookies:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Google Analytics</strong> - Helps us understand how visitors use our site. 
                    <a href="https://policies.google.com/privacy" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Google AdSense</strong> - Displays advertisements on our platform. 
                    <a href="https://policies.google.com/technologies/ads" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      Ad Policy
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Supabase</strong> - Provides authentication and database services. 
                    <a href="https://supabase.com/privacy" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Cookie Banner:</strong> Use our cookie consent banner to set your preferences</li>
                <li>• <strong>Browser Settings:</strong> Configure your browser to block or delete cookies</li>
                <li>• <strong>Ad Preferences:</strong> Visit <a href="https://adssettings.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> to control ad personalization</li>
                <li>• <strong>Analytics Opt-out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
                <li>• <strong>Do Not Track:</strong> Enable "Do Not Track" in your browser settings</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                Note: Blocking essential cookies may prevent you from using some features of our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Questions About Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@opportunityhub.com</p>
                <p><strong>Address:</strong> 123 Innovation Drive, Tech City, TC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Cookies;
