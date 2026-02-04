
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, AlertTriangle, CreditCard, Ban, Scale, Globe } from 'lucide-react';
import SEO from '@/components/SEO';

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing and using OpportunityHub, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, please do not use our service.",
        "We reserve the right to modify these terms at any time with notice to users.",
        "Continued use of the service after changes constitutes acceptance of new terms.",
        "You must be at least 16 years old to use this service."
      ]
    },
    {
      title: "User Responsibilities",
      icon: Users,
      content: [
        "You must provide accurate and complete information when creating an account.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must not use the service for any illegal or unauthorized purpose.",
        "You agree not to spam, harass, or abuse other users or the platform.",
        "You must respect intellectual property rights of others.",
        "You agree not to attempt to circumvent security measures or access restrictions.",
        "You are responsible for all activities that occur under your account."
      ]
    },
    {
      title: "Platform Usage",
      icon: Shield,
      content: [
        "OpportunityHub provides a platform for finding internships, jobs, and scholarships.",
        "We do not guarantee the accuracy or availability of listed opportunities.",
        "Users are responsible for verifying information with opportunity providers.",
        "We are not liable for any losses resulting from use of our platform.",
        "We reserve the right to remove content or suspend accounts that violate our terms.",
        "Opportunity listings may expire and be removed from the platform automatically."
      ]
    },
    {
      title: "Advertising & Monetization",
      icon: CreditCard,
      content: [
        "OpportunityHub displays third-party advertisements to support the free service.",
        "Ads are served by Google AdSense and other advertising partners.",
        "We may offer premium features or subscriptions in the future.",
        "You agree not to use ad-blocking software in a way that violates our terms.",
        "Sponsored or featured opportunities will be clearly labeled as such.",
        "We do not endorse advertised products or services unless explicitly stated."
      ]
    },
    {
      title: "Prohibited Activities",
      icon: Ban,
      content: [
        "Posting fake, misleading, or fraudulent opportunity listings.",
        "Scraping, crawling, or automated data collection without permission.",
        "Attempting to hack, exploit, or compromise platform security.",
        "Creating multiple accounts to circumvent restrictions or bans.",
        "Selling, sharing, or transferring your account to others.",
        "Using the platform to distribute malware or phishing content.",
        "Impersonating other users, companies, or organizations.",
        "Circumventing ad delivery or click fraud."
      ]
    },
    {
      title: "Intellectual Property",
      icon: Scale,
      content: [
        "All platform content, design, and code is owned by OpportunityHub.",
        "Users retain ownership of content they submit (resumes, profiles).",
        "By submitting content, you grant us a license to display and distribute it.",
        "You may not copy, reproduce, or redistribute platform content without permission.",
        "Trademarks and logos are protected intellectual property."
      ]
    },
    {
      title: "Limitations and Disclaimers",
      icon: AlertTriangle,
      content: [
        "The service is provided 'as is' without warranties of any kind.",
        "We do not guarantee uninterrupted or error-free service.",
        "Our liability is limited to the maximum extent permitted by law.",
        "We are not responsible for third-party content or external links.",
        "We do not guarantee employment or acceptance to any opportunity.",
        "Force majeure events may affect service availability."
      ]
    },
    {
      title: "Governing Law & Disputes",
      icon: Globe,
      content: [
        "These terms are governed by the laws of the jurisdiction where we operate.",
        "Disputes will be resolved through binding arbitration when possible.",
        "You waive the right to participate in class action lawsuits.",
        "Small claims court remains available for eligible disputes.",
        "We will attempt to resolve disputes informally before legal action."
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Terms of Service - OpportunityHub"
        description="Read the Terms of Service for OpportunityHub. Understand your rights and responsibilities when using our platform for finding opportunities."
      />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">Please read these terms carefully before using OpportunityHub.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: February 2025</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Agreement Overview</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service ("Terms") govern your use of OpportunityHub, a platform designed to connect students 
                and professionals with internships, job opportunities, and scholarships. By using our service, 
                you agree to these legally binding terms.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Important Notice:</strong> OpportunityHub is a free platform supported by advertising. 
                By using our service, you acknowledge that advertisements will be displayed, and our advertising 
                partners may collect information about your browsing activities in accordance with our Privacy Policy.
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
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We reserve the right to terminate or suspend accounts that:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Violate these terms of service</li>
                <li>• Engage in fraudulent or illegal activities</li>
                <li>• Abuse or harass other users</li>
                <li>• Attempt to compromise platform security</li>
                <li>• Remain inactive for extended periods</li>
                <li>• Engage in any form of click fraud or ad manipulation</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You may delete your account at any time through your profile settings. Upon termination, 
                your data will be handled according to our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless OpportunityHub, its affiliates, officers, directors, 
                employees, and agents from any claims, damages, losses, liabilities, and expenses (including 
                legal fees) arising from your use of the platform, your violation of these Terms, or your 
                violation of any rights of another party.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Severability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall 
                be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise 
                remain in full force and effect.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@opportunityhub.com</p>
                <p><strong>Support:</strong> support@opportunityhub.com</p>
                <p><strong>Address:</strong> 123 Innovation Drive, Tech City, TC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Terms;
