
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Zap, Heart, Award, Globe, BookOpen, Shield } from 'lucide-react';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';
import SEO from '@/components/SEO';

const About = () => {
  const { getSetting } = usePlatformSettings();
  const companyName = getSetting('company_name', 'Rollno31 Edtech Private Limited');
  const contactEmail = getSetting('contact_email', '');
  const contactAddress = getSetting('contact_address', '');

  const values = [
    { icon: Target, title: "Mission-Driven", description: "We're committed to democratizing access to career opportunities for every student and professional, regardless of background." },
    { icon: Users, title: "Community-First", description: "Our platform thrives on the contributions and engagement of our vibrant user community." },
    { icon: Zap, title: "Innovation", description: "We continuously evolve our platform with cutting-edge technology to deliver the best user experience." },
    { icon: Heart, title: "Empathy", description: "We understand the challenges of finding the right opportunities and design solutions with care." },
    { icon: Shield, title: "Trust & Transparency", description: "Every opportunity listed is verified. We maintain the highest standards of data privacy and security." },
    { icon: BookOpen, title: "Education", description: "Beyond listings, we provide career insights, guides, and resources to help users grow professionally." },
  ];

  return (
    <>
      <SEO 
        title="About Us - OpportunityHub by Rollno31 Edtech"
        description="Learn about OpportunityHub, a product of Rollno31 Edtech Private Limited. We connect students and professionals with curated career opportunities worldwide."
      />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About OpportunityHub</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-blue-100">
              A product of {companyName}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Mission Statement */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                <p>
                  OpportunityHub was founded by {companyName} with a clear and unwavering mission: to bridge the gap 
                  between ambition and opportunity. We recognized that countless talented students and early-career professionals 
                  across India and the world miss out on life-changing opportunities simply because they lack access to the right 
                  information at the right time.
                </p>
                <p>
                  Our platform serves as a comprehensive, centralized hub that aggregates and curates the best internships, 
                  job openings, contests, fellowships, workshops, and scholarships from hundreds of sources. Unlike generic job 
                  boards, we focus specifically on the needs of students and young professionals, providing not just listings but 
                  actionable career guidance through our Career Insights blog, AI-powered resume tools, and personalized recommendations.
                </p>
                <p>
                  We believe that talent is universal, but opportunity is not. By democratizing access to quality opportunities and 
                  equipping users with the knowledge and tools they need to succeed, we aim to level the playing field. Every feature 
                  we build, every article we publish, and every opportunity we curate is driven by our commitment to empowering the 
                  next generation of professionals. At {companyName}, we are building more than a platform — we are building a 
                  movement towards equal access to career success.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What We Offer */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-center">What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Curated Opportunities', desc: 'Hand-picked internships, jobs, contests, and scholarships from verified sources across industries.' },
                  { title: 'Career Insights Blog', desc: '20+ original articles covering interview prep, salary negotiation, resume writing, and industry trends.' },
                  { title: 'Advanced Search & Filters', desc: 'Find exactly what you need with powerful search filters by type, domain, location, and more.' },
                  { title: 'Resume Builder', desc: 'Build a professional resume tailored to your target roles with our guided builder tool.' },
                  { title: 'Real-Time Notifications', desc: 'Get instant alerts when new opportunities matching your interests are posted.' },
                  { title: 'Bookmark & Track', desc: 'Save opportunities you like and track application deadlines effortlessly.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="mb-16 border-yellow-200 dark:border-yellow-900">
            <CardHeader>
              <CardTitle>Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                OpportunityHub aggregates and curates opportunities from various third-party sources. We do not directly 
                offer jobs, internships, or scholarships. All listings are sourced from publicly available information and 
                official company career pages. Users are encouraged to verify all details with the original source before 
                applying. {companyName} is not responsible for the accuracy of third-party listings or the outcome of any applications.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Company:</strong> {companyName}</p>
                {contactEmail && <p><strong>Email:</strong> {contactEmail}</p>}
                {contactAddress && <p><strong>Address:</strong> {contactAddress}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default About;
