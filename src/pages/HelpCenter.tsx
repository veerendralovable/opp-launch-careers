
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, Book, MessageCircle, Video, FileText, ArrowRight, Users, Shield, Bookmark, Bell, Settings } from 'lucide-react';
import SEO from '@/components/SEO';

const HelpCenter = () => {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: Book,
      articles: [
        { title: "How to create an account", content: "Visit the Sign Up page and register with your email address. You will receive a confirmation email. Once verified, complete your profile with your skills, education, and experience for the best experience." },
        { title: "Setting up your profile", content: "Navigate to your Profile page after logging in. Add your name, bio, skills, education details, and optionally your LinkedIn, GitHub, and website URLs. A complete profile helps you track applications effectively." },
        { title: "Finding opportunities", content: "Use the Opportunities page to browse all listings. You can search by keyword, filter by type (Internship, Job, Scholarship, Contest), domain, and location. Use the Advanced Search for more refined results." },
        { title: "Understanding opportunity types", content: "OpportunityHub lists several types: Internships (short-term work experience), Jobs (full-time or part-time positions), Scholarships (financial aid for education), Contests (hackathons, competitions), and Fellowships (research or study programs)." },
      ]
    },
    {
      title: "Using Features",
      icon: FileText,
      articles: [
        { title: "How to bookmark opportunities", content: "Click the bookmark icon on any opportunity card to save it. Access all your bookmarks from the Bookmarks page in your dashboard. Use bookmarks to compare opportunities and track deadlines." },
        { title: "Submitting new opportunities", content: "Registered users can submit opportunities through the Submit page. Fill in the title, description, company, location, type, and deadline. All submissions are reviewed by our moderation team before being published." },
        { title: "Understanding the approval process", content: "When you submit an opportunity, it enters a moderation queue. Our team reviews it for accuracy, authenticity, and compliance with our guidelines. Most submissions are reviewed within 24 hours." },
        { title: "Using the resume builder", content: "Navigate to the Resume Builder from your dashboard. The tool guides you through creating each section of your resume with professional templates optimized for ATS compatibility." },
      ]
    },
    {
      title: "Notifications & Alerts",
      icon: Bell,
      articles: [
        { title: "Setting up notifications", content: "Enable notifications from your dashboard to receive alerts when new opportunities matching your profile are posted. You can customize which types of notifications you receive." },
        { title: "Email notifications", content: "You may receive email notifications about new opportunities, platform updates, and important announcements. You can manage email preferences from your profile settings." },
        { title: "Managing notification preferences", content: "Go to your Profile settings to control which notifications you receive. You can toggle between in-app notifications, email alerts, or both depending on your preferences." },
      ]
    },
    {
      title: "Account & Security",
      icon: Shield,
      articles: [
        { title: "Updating your profile", content: "Visit the Profile page to update your personal information, skills, education, and contact details at any time. Keeping your profile current helps you get relevant opportunity recommendations." },
        { title: "Privacy and data protection", content: "We take your privacy seriously. Your data is encrypted in transit and at rest. We comply with GDPR and CCPA regulations. Read our full Privacy Policy for details on how we handle your information." },
        { title: "Account security best practices", content: "Use a strong, unique password for your account. Do not share your login credentials. If you suspect unauthorized access, change your password immediately and contact our support team." },
        { title: "Deleting your account", content: "You can request account deletion by contacting our support team. We will remove all your personal data from our systems in compliance with applicable data protection laws." },
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I find opportunities that match my interests?",
      answer: "Use our advanced filtering system on the Opportunities page to filter by type, domain, location, and search for specific keywords. You can also save searches and enable notifications to get alerts when new matching opportunities are posted."
    },
    {
      question: "Can I submit opportunities from my organization?",
      answer: "Yes! Any registered user can submit opportunities through the Submit page. All submissions go through a moderation process to ensure quality and accuracy before being published on the platform."
    },
    {
      question: "Is OpportunityHub free to use?",
      answer: "Yes, OpportunityHub is completely free for all users. All features including browsing, bookmarking, notifications, the career blog, career guides, and the resume builder are available at no cost. We sustain the platform through non-intrusive advertising."
    },
    {
      question: "How often are new opportunities added?",
      answer: "New opportunities are added daily by our team and community members. We recommend enabling notifications or checking back regularly. You can also follow our blog for career tips and industry updates."
    },
    {
      question: "Are the opportunities verified?",
      answer: "Yes, every opportunity goes through our moderation pipeline before being published. We verify company information, check for accuracy, and remove fraudulent or misleading listings. However, we always recommend verifying details with the original source before applying."
    },
    {
      question: "How can I report a problem or suspicious listing?",
      answer: "If you encounter a suspicious listing or experience any issues, please contact us through our Contact page. Provide the listing URL and details about the issue, and our team will investigate promptly."
    }
  ];

  return (
    <>
      <SEO 
        title="Help Center — Support & Guides | OpportunityHub"
        description="Get help with OpportunityHub. Find answers to common questions, learn how to use platform features, and contact our support team."
      />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Find answers to common questions, learn how to use every feature, and get support when you need it.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {helpCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.articles.map((article, idx) => (
                      <div key={idx} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                        <h4 className="font-medium text-foreground mb-1">{article.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{article.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-b-0">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* More Resources */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">More Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Book className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Career Guides</h3>
                  <p className="text-sm text-muted-foreground mb-4">In-depth guides on interviews, resumes, and scholarships.</p>
                  <Link to="/guides"><Button variant="outline" size="sm">View Guides <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Career Blog</h3>
                  <p className="text-sm text-muted-foreground mb-4">20+ articles on career tips, trends, and advice.</p>
                  <Link to="/blog"><Button variant="outline" size="sm">Read Blog <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <HelpCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Full FAQ</h3>
                  <p className="text-sm text-muted-foreground mb-4">18+ questions organized by category.</p>
                  <Link to="/faq"><Button variant="outline" size="sm">View FAQ <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Can't find what you are looking for? Our support team is ready to assist you with any questions or concerns.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Contact Support <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
