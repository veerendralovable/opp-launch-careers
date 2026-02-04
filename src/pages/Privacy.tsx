
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Users, Cookie, Target, Globe, Bell } from 'lucide-react';
import SEO from '@/components/SEO';

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: Eye,
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
      title: "How We Use Your Information",
      icon: Users,
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
      title: "Advertising & Third-Party Partners",
      icon: Target,
      content: [
        "We display advertisements from Google AdSense and other networks",
        "Ad partners may use cookies to serve personalized ads based on your interests",
        "We share anonymized usage data with analytics providers",
        "You can opt-out of personalized advertising in your cookie preferences",
        "Ad revenue helps us keep the platform free for all users",
        "We never sell your personal contact information to advertisers"
      ]
    },
    {
      title: "Cookies & Tracking Technologies",
      icon: Cookie,
      content: [
        "Essential cookies: Required for login, security, and basic functionality",
        "Analytics cookies: Help us understand how visitors use our site (Google Analytics)",
        "Advertising cookies: Enable personalized ads and measure ad performance",
        "Functional cookies: Remember your preferences and settings",
        "You can manage cookie preferences through our consent banner",
        "Blocking essential cookies may prevent you from using some features"
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "Industry-standard TLS encryption for all data transmission",
        "Secure cloud infrastructure with regular security audits",
        "Password hashing using bcrypt algorithm",
        "Role-based access control for internal systems",
        "Regular security monitoring and incident response",
        "Data backup and disaster recovery procedures",
        "Compliance with industry security standards"
      ]
    },
    {
      title: "Your Rights (GDPR/CCPA)",
      icon: Shield,
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
      title: "International Data Transfers",
      icon: Globe,
      content: [
        "Your data may be processed in countries outside your residence",
        "We use services hosted in the United States and European Union",
        "We ensure appropriate safeguards for international transfers",
        "Standard contractual clauses are used where required",
        "By using our service, you consent to these transfers"
      ]
    },
    {
      title: "Communications & Marketing",
      icon: Bell,
      content: [
        "We send transactional emails (account verification, password reset)",
        "You may receive opportunity alerts based on your preferences",
        "Marketing emails include an unsubscribe link",
        "You can manage notification preferences in your profile settings",
        "We may send important service announcements to all users"
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Privacy Policy - OpportunityHub"
        description="Learn how OpportunityHub collects, uses, and protects your personal information. Our privacy policy covers cookies, advertising, and your data rights."
      />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">Your privacy is important to us. Here's how we protect and use your information.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: February 2025</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Commitment to Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">
                At OpportunityHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, share, and safeguard your data when you use our platform. 
                By using OpportunityHub, you agree to the collection and use of information in accordance with this policy.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Important:</strong> We display third-party advertisements on our platform. These advertisers may use cookies 
                and similar technologies to collect information about your browsing activities. You can manage your advertising 
                preferences through our cookie consent banner.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 mb-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, idx) => (
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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use trusted third-party services to provide and improve our platform:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Supabase:</strong> Authentication, database, and file storage</li>
                <li>• <strong>Google Analytics:</strong> Website traffic and usage analytics</li>
                <li>• <strong>Google AdSense:</strong> Display advertising network</li>
                <li>• <strong>Vercel:</strong> Website hosting and content delivery</li>
                <li>• <strong>Email Services:</strong> Transactional and notification emails</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Each of these services has their own privacy policies. We encourage you to review them.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We retain your personal data only as long as necessary:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Account data:</strong> Until you delete your account</li>
                <li>• <strong>Analytics data:</strong> Aggregated for up to 26 months</li>
                <li>• <strong>Security logs:</strong> Retained for 12 months</li>
                <li>• <strong>Backup data:</strong> Deleted within 30 days of account deletion</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                OpportunityHub is not intended for children under 16 years of age. We do not knowingly collect 
                personal information from children. If you are a parent or guardian and believe your child has 
                provided us with personal information, please contact us immediately. We will take steps to 
                remove such information from our systems.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage 
                you to review this Privacy Policy periodically. Your continued use of the platform after any 
                changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy, wish to exercise your data rights, or have concerns 
                about how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@opportunityhub.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@opportunityhub.com</p>
                <p><strong>Address:</strong> 123 Innovation Drive, Tech City, TC 12345</p>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                We aim to respond to all privacy-related inquiries within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Privacy;
