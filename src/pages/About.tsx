
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Zap, Heart, Award, Globe, BookOpen, Shield, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OpportunityHub",
    "legalName": companyName,
    "url": "https://opp-launch-careers-hub.vercel.app",
    "description": "OpportunityHub connects students and professionals with curated career opportunities worldwide.",
    "foundingDate": "2025",
    "founders": [{ "@type": "Person", "name": "Rollno31 Edtech Team" }],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  return (
    <>
      <SEO 
        title="About Us — OpportunityHub by Rollno31 Edtech Private Limited"
        description="Learn about OpportunityHub, a product of Rollno31 Edtech Private Limited. We connect students and professionals with curated career opportunities worldwide."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About OpportunityHub</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-blue-100">
              A product of {companyName} — Bridging the gap between ambition and opportunity since 2025.
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
                  actionable career guidance through our Career Insights blog, in-depth career guides, and personalized recommendations.
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

          {/* What Makes Us Different */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-center">What Makes Us Different</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Built for Students, Not Recruiters</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Most job platforms are designed for recruiters who pay for access. OpportunityHub is designed for the job seeker first. 
                    Our interface, features, and content are all built around what students and early-career professionals actually need: 
                    clear information, easy discovery, and actionable advice. We do not charge students or professionals to access any 
                    feature on our platform.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Quality Over Quantity</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not scrape the internet and dump thousands of unverified listings. Every opportunity on OpportunityHub goes 
                    through our moderation pipeline. We verify company information, check for accuracy, remove duplicates, and flag 
                    listings that appear suspicious. This means fewer but higher-quality opportunities that you can trust.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Comprehensive Career Resources</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Beyond listings, we invest in creating original educational content. Our Career Insights blog features 20+ articles 
                    on topics like interview preparation, resume optimization, and salary negotiation. Our career guides provide in-depth, 
                    step-by-step instructions on critical career skills. We believe finding the opportunity is only half the battle — 
                    being prepared to seize it is equally important.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Transparent & Privacy-Respecting</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We are upfront about how we operate. OpportunityHub is sustained through advertising, and we clearly label all 
                    sponsored content. We comply with GDPR and CCPA regulations, give you full control over your data, and never sell 
                    your personal information. You can read our full Privacy Policy and Terms of Service for complete transparency.
                  </p>
                </div>
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

          {/* Platform Stats / Social Proof */}
          <Card className="mb-16 bg-primary/5 border-primary/20">
            <CardContent className="py-10">
              <h2 className="text-2xl font-bold text-center text-foreground mb-8">Platform Highlights</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground">Free to Use</p>
                </div>
                <div>
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">Verified</p>
                  <p className="text-sm text-muted-foreground">Moderated Listings</p>
                </div>
                <div>
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">20+</p>
                  <p className="text-sm text-muted-foreground">Career Articles</p>
                </div>
                <div>
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">India & Global</p>
                  <p className="text-sm text-muted-foreground">Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We Offer */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-center">What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Curated Opportunities', desc: 'Hand-picked internships, jobs, contests, and scholarships from verified sources across industries and domains.' },
                  { title: 'Career Insights Blog', desc: '20+ original articles covering interview prep, salary negotiation, resume writing, and industry trends written by professionals.' },
                  { title: 'In-Depth Career Guides', desc: 'Comprehensive guides on interview preparation, resume writing, and scholarship applications with actionable advice.' },
                  { title: 'Advanced Search & Filters', desc: 'Find exactly what you need with powerful search filters by type, domain, location, deadline, and experience level.' },
                  { title: 'Resume Builder', desc: 'Build a professional resume tailored to your target roles with our guided builder tool.' },
                  { title: 'Real-Time Notifications', desc: 'Get instant alerts when new opportunities matching your interests are posted on the platform.' },
                  { title: 'Bookmark & Track', desc: 'Save opportunities you like and track application deadlines effortlessly from your dashboard.' },
                  { title: 'FAQ & Help Center', desc: 'Comprehensive FAQ section and help center with detailed guidance on using every feature of the platform.' },
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
              <p className="text-muted-foreground leading-relaxed">
                OpportunityHub aggregates and curates opportunities from various third-party sources. We do not directly 
                offer jobs, internships, or scholarships. All listings are sourced from publicly available information and 
                official company career pages. Users are encouraged to verify all details with the original source before 
                applying. {companyName} is not responsible for the accuracy of third-party listings or the outcome of any applications.
              </p>
            </CardContent>
          </Card>

          {/* Explore */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Explore OpportunityHub</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/opportunities"><Button>Browse Opportunities <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/blog"><Button variant="outline">Career Blog <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/guides"><Button variant="outline">Career Guides <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/faq"><Button variant="outline">FAQ <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            </div>
          </div>

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
                <p className="mt-4">
                  Have questions? Visit our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link> or 
                  <Link to="/contact" className="text-primary hover:underline ml-1">contact us directly</Link>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default About;
