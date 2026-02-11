
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, AlertTriangle, CreditCard, Ban, Scale, Globe } from 'lucide-react';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import SEO from '@/components/SEO';

const Terms = () => {
  const { getSetting } = usePlatformSettings();
  const companyName = getSetting('company_name', 'Rollno31 Edtech Private Limited');
  const contactEmail = getSetting('contact_email', '');
  const legalEmail = getSetting('legal_email', '');
  const contactAddress = getSetting('contact_address', '');

  const sections = [
    {
      title: "Acceptance of Terms", icon: FileText,
      content: [
        "By accessing and using OpportunityHub, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, please do not use our service.",
        "We reserve the right to modify these terms at any time with notice to users.",
        "Continued use of the service after changes constitutes acceptance of new terms.",
        "You must be at least 16 years old to use this service."
      ]
    },
    {
      title: "Nature of Service", icon: Globe,
      content: [
        "OpportunityHub is an aggregation platform that curates opportunities from third-party sources.",
        "We do not directly offer jobs, internships, scholarships, or any employment.",
        "All listings are sourced from publicly available information and official company pages.",
        "Users should verify all details with the original source before applying.",
        `${companyName} is not responsible for the accuracy of third-party listings or outcomes of applications.`,
        "We provide career guidance content through our blog but this does not constitute professional advice."
      ]
    },
    {
      title: "User Responsibilities", icon: Users,
      content: [
        "You must provide accurate and complete information when creating an account.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must not use the service for any illegal or unauthorized purpose.",
        "You agree not to spam, harass, or abuse other users or the platform.",
        "You must respect intellectual property rights of others.",
        "You are responsible for all activities that occur under your account."
      ]
    },
    {
      title: "Advertising & Monetization", icon: CreditCard,
      content: [
        "OpportunityHub displays third-party advertisements to support the free service.",
        "Ads are served by Google AdSense and other advertising partners.",
        "Sponsored or featured opportunities will be clearly labeled as such.",
        "We do not endorse advertised products or services unless explicitly stated."
      ]
    },
    {
      title: "Prohibited Activities", icon: Ban,
      content: [
        "Posting fake, misleading, or fraudulent opportunity listings.",
        "Scraping, crawling, or automated data collection without permission.",
        "Attempting to hack, exploit, or compromise platform security.",
        "Creating multiple accounts to circumvent restrictions or bans.",
        "Using the platform to distribute malware or phishing content.",
        "Impersonating other users, companies, or organizations.",
        "Circumventing ad delivery or click fraud."
      ]
    },
    {
      title: "Intellectual Property", icon: Scale,
      content: [
        `All platform content, design, and code is owned by ${companyName}.`,
        "Users retain ownership of content they submit (resumes, profiles).",
        "By submitting content, you grant us a license to display and distribute it.",
        "You may not copy, reproduce, or redistribute platform content without permission."
      ]
    },
    {
      title: "Limitations and Disclaimers", icon: AlertTriangle,
      content: [
        "The service is provided 'as is' without warranties of any kind.",
        "We do not guarantee uninterrupted or error-free service.",
        "Our liability is limited to the maximum extent permitted by law.",
        "We are not responsible for third-party content or external links.",
        "We do not guarantee employment or acceptance to any opportunity."
      ]
    },
    {
      title: "Governing Law", icon: Shield,
      content: [
        "These terms are governed by the laws of India.",
        "Any disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana, India.",
        "We will attempt to resolve disputes informally before legal action."
      ]
    }
  ];

  return (
    <>
      <SEO title="Terms of Service - OpportunityHub" description="Read the Terms of Service for OpportunityHub. Understand your rights and responsibilities when using our platform." />
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">Please read these terms carefully before using OpportunityHub.</p>
            <p className="text-sm text-muted-foreground mt-4">Last updated: February 2026 | Operated by {companyName}</p>
          </div>

          <Card className="mb-8">
            <CardHeader><CardTitle>Agreement Overview</CardTitle></CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service govern your use of OpportunityHub, operated by {companyName}. 
                OpportunityHub is a career opportunity aggregation platform that curates internships, job opportunities, 
                contests, fellowships, and scholarships from third-party sources. By using our service, you agree to these legally binding terms.
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

          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Company:</strong> {companyName}</p>
                {legalEmail && <p><strong>Legal:</strong> {legalEmail}</p>}
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

export default Terms;
