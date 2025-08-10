
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, AlertTriangle } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing and using OpportunityHub, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, please do not use our service.",
        "We reserve the right to modify these terms at any time with notice to users.",
        "Continued use of the service after changes constitutes acceptance of new terms."
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
        "You must respect intellectual property rights of others."
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
        "We reserve the right to remove content or suspend accounts that violate our terms."
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
        "These terms are governed by the laws of the jurisdiction where we operate."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Please read these terms carefully before using OpportunityHub.</p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Agreement Overview</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service govern your use of OpportunityHub, a platform designed to connect students 
              and professionals with internships, job opportunities, and scholarships. By using our service, 
              you agree to these legally binding terms.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 mb-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <section.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
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
            <p className="text-gray-600 mb-4">
              We reserve the right to terminate or suspend accounts that:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Violate these terms of service</li>
              <li>• Engage in fraudulent or illegal activities</li>
              <li>• Abuse or harass other users</li>
              <li>• Attempt to compromise platform security</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: legal@opportunityhub.com</p>
              <p>Address: 123 Innovation Drive, Tech City, TC 12345</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
