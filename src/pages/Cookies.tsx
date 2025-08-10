
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, BarChart3, Shield } from 'lucide-react';

const Cookies = () => {
  const cookieTypes = [
    {
      title: "Essential Cookies",
      icon: Shield,
      description: "Required for basic functionality",
      content: [
        "Authentication and login state",
        "Security and fraud prevention",
        "Basic site functionality",
        "Session management"
      ]
    },
    {
      title: "Functional Cookies",
      icon: Settings,
      description: "Enhance your experience",
      content: [
        "Language and region preferences",
        "Theme and display settings",
        "Form data and user preferences",
        "Accessibility features"
      ]
    },
    {
      title: "Analytics Cookies",
      icon: BarChart3,
      description: "Help us improve our service",
      content: [
        "Usage statistics and patterns",
        "Performance monitoring",
        "Error tracking and debugging",
        "Feature usage analytics"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Cookie className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">How we use cookies to improve your experience on OpportunityHub.</p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 2024</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              helping us understand how you use our platform.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 mb-8">
          {cookieTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <type.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div>{type.title}</div>
                    <div className="text-sm text-gray-500 font-normal">{type.description}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {type.content.map((item, idx) => (
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
            <CardTitle>Managing Your Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Use your browser settings to block or delete cookies</li>
              <li>• Opt out of analytics cookies through our preferences center</li>
              <li>• Use browser extensions to manage cookie permissions</li>
              <li>• Enable "Do Not Track" in your browser settings</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Please note that disabling essential cookies may affect the functionality of our platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We may use third-party services that set their own cookies:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Google Analytics for usage statistics</li>
              <li>• Authentication providers for secure login</li>
              <li>• Content delivery networks for performance</li>
              <li>• Social media platforms for sharing features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions About Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: privacy@opportunityhub.com</p>
              <p>Address: 123 Innovation Drive, Tech City, TC 12345</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cookies;
