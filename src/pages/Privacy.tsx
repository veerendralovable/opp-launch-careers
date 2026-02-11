
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, Cookie, Target, Globe, Bell } from 'lucide-react';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import SEO from '@/components/SEO';

const Privacy = () => {
  const { getSetting } = usePlatformSettings();
  const companyName = getSetting('company_name', 'Rollno31 Edtech Private Limited');
  const contactEmail = getSetting('contact_email', '');
  const privacyEmail = getSetting('privacy_email', '');
  const contactAddress = getSetting('contact_address', '');

  const sections = [
    {
      title: "Information We Collect", icon: Eye,
      content: [
        "Account information (name, email address, password hash)",
        "Profile information you choose to provide (skills, education, resume)",
        "Usage data and analytics (pages visited, features used, session duration)",
        "Device information (browser type, operating system, screen resolution)",
        "Location data (country, region - derived from IP address)",
        "Communications with our support team",
        "Cookies and similar tracking technologies"
      ]
    },
    {
      title: "How We Use Your Information", icon: Users,
      content: [
        "Provide and maintain our platform services",
        "Match you with relevant opportunities based on your profile",
        "Send you notifications about new opportunities and updates",
        "Personalize your experience and recommendations",
        "Improve our platform through analytics and user feedback",
        "Respond to your inquiries and support requests",
        "Detect and prevent fraud or abuse",
        "Comply with legal obligations"
      ]
    },
    {
      title: "Google AdSense & DART Cookies", icon: Target,
      content: [
        "We use Google AdSense to display advertisements on our platform",
        "Google uses the DART cookie to serve ads based on your visit to this site and other sites on the Internet",
        "Users may opt out of the DART cookie by visiting the Google Ad and Content Network Privacy Policy at google.com/policies/technologies/ads",
        "Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their advertisements",
        "These technologies are used to measure the effectiveness of advertising campaigns and personalize ad content",
        "OpportunityHub does not have access to or control over cookies used by third-party advertisers",
        "You can manage cookie preferences through our consent banner or your browser settings",
        "Ad revenue helps us keep the platform free for all users"
      ]
    },
    {
      title: "Cookies & Tracking Technologies", icon: Cookie,
      content: [
        "Essential cookies: Required for login, security, and basic functionality",
        "Analytics cookies: Help us understand how visitors use our site (Google Analytics)",
        "Advertising cookies: Enable personalized ads and measure ad performance (Google DART cookie)",
        "Functional cookies: Remember your preferences and settings",
        "You can manage cookie preferences through our consent banner",
        "Blocking essential cookies may prevent you from using some features"
      ]
    },
    {
      title: "Data Security", icon: Lock,
      content: [
        "Industry-standard TLS encryption for all data transmission",
        "Secure cloud infrastructure with regular security audits",
        "Password hashing using bcrypt algorithm",
        "Role-based access control for internal systems",
        "Regular security monitoring and incident response",
        "Data backup and disaster recovery procedures"
      ]
    },
    {
      title: "Your Rights (GDPR/CCPA)", icon: Shield,
      content: [
        "Access: Request a copy of your personal data",
        "Rectification: Correct inaccurate or incomplete information",
        "Erasure: Delete your account and all associated data",
        "Portability: Export your data in a machine-readable format",
        "Restriction: Limit how we process your data",
        "Objection: Opt-out of marketing and profiling",
        "Withdraw Consent: Change your cookie and privacy preferences anytime"
      ]
    },
    {
      title: "International Data Transfers", icon: Globe,
      content: [
        "Your data may be processed in countries outside your residence",
        "We use services hosted in the United States and European Union",
        "We ensure appropriate safeguards for international transfers",
        "Standard contractual clauses are used where required"
      ]
    },
    {
      title: "Communications & Marketing", icon: Bell,
      content: [
        "We send transactional emails (account verification, password reset)",
        "You may receive opportunity alerts based on your preferences",
        "Marketing emails include an unsubscribe link",
        "You can manage notification preferences in your profile settings"
      ]
    }
  ];

  return (
    <>
      <SEO title="Privacy Policy - OpportunityHub" description="Learn how OpportunityHub collects, uses, and protects your personal information including Google AdSense DART cookie disclosures." />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">Your privacy is important to us.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: February 2026 | Operated by {companyName}</p>
          </div>

          <Card className="mb-8">
            <CardHeader><CardTitle>Our Commitment to Privacy</CardTitle></CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">
                At OpportunityHub, operated by {companyName}, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, share, and safeguard your data when you use our platform. 
                By using OpportunityHub, you agree to the collection and use of information in accordance with this policy.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Important:</strong> We display third-party advertisements through Google AdSense on our platform. Google, as a third-party vendor, 
                uses the DART cookie to serve ads based on your visits to this and other sites. You may opt out of the use of the DART cookie by visiting 
                the <a href="https://policies.google.com/technologies/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings page</a>.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 mb-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg"><section.icon className="h-5 w-5 text-primary" /></div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, idx) => (
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

          <Card className="mb-8">
            <CardHeader><CardTitle>Third-Party Services</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Supabase:</strong> Authentication, database, and file storage</li>
                <li>• <strong>Google Analytics:</strong> Website traffic and usage analytics</li>
                <li>• <strong>Google AdSense:</strong> Display advertising network (uses DART cookies)</li>
                <li>• <strong>Vercel:</strong> Website hosting and content delivery</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact Us</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">For privacy-related inquiries:</p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Company:</strong> {companyName}</p>
                {privacyEmail && <p><strong>Privacy Email:</strong> {privacyEmail}</p>}
                {contactEmail && <p><strong>Support:</strong> {contactEmail}</p>}
                {contactAddress && <p><strong>Address:</strong> {contactAddress}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Privacy;
