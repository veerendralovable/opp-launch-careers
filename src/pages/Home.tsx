
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { 
  Search, 
  TrendingUp, 
  Users, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  Sparkles,
  BookOpen,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Target,
  Globe,
  Lightbulb,
  Heart,
  Zap
} from 'lucide-react';

interface FeaturedOpportunity {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  type: string;
  deadline: string | null;
  tags: string[] | null;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOpportunities, setFeaturedOpportunities] = useState<FeaturedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [stats, setStats] = useState({
    opportunities: 0,
    scholarships: 0,
    companies: 0
  });

  useEffect(() => {
    fetchFeaturedOpportunities();
    fetchStats();
  }, []);

  const fetchFeaturedOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('id, title, company, location, type, deadline, tags')
        .eq('is_approved', true)
        .eq('is_expired', false)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setFeaturedOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching featured opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: oppCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true)
        .eq('is_expired', false);

      const { count: scholarshipCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true)
        .eq('type', 'Scholarship');

      const uniqueCompanies = new Set();
      const { data: companyData } = await supabase
        .from('opportunities')
        .select('company')
        .eq('is_approved', true)
        .not('company', 'is', null);
      companyData?.forEach(c => { if (c.company) uniqueCompanies.add(c.company); });

      setStats({
        opportunities: oppCount || 0,
        scholarships: scholarshipCount || 0,
        companies: uniqueCompanies.size
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/opportunities?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const faqs = [
    {
      q: "What is OpportunityHub and how does it work?",
      a: "OpportunityHub is a free career opportunity aggregation platform operated by Rollno31 Edtech Private Limited. We curate and list internships, jobs, scholarships, contests, and fellowships from verified third-party sources across India and globally. You can browse, search, filter, and bookmark opportunities — all in one place. Create a free account to unlock features like saved bookmarks, personalized alerts, and the resume builder."
    },
    {
      q: "Is OpportunityHub free to use?",
      a: "Yes, OpportunityHub is completely free for all users. You can browse opportunities, read our career insights blog, use the advanced search filters, and bookmark listings without any charges. We sustain the platform through non-intrusive advertising, which allows us to keep all features accessible to everyone."
    },
    {
      q: "How are opportunities verified before being listed?",
      a: "Every opportunity submitted to our platform goes through a moderation process. Our team reviews each listing for authenticity, accuracy, and relevance before it becomes publicly visible. We source opportunities from official company career pages, reputable job boards, and verified organizations to ensure quality."
    },
    {
      q: "Can I submit an opportunity from my organization?",
      a: "Absolutely! Any registered user can submit opportunities. Once submitted, your listing enters our moderation queue where it is reviewed for accuracy and compliance with our guidelines. Approved listings go live within 24 hours and reach thousands of students and professionals."
    },
    {
      q: "How do I get notified about new opportunities?",
      a: "After creating your free account, you can enable real-time notifications from your dashboard. You will receive alerts when new opportunities matching your interests are posted. You can also bookmark opportunities and track application deadlines directly from your profile."
    },
    {
      q: "What types of opportunities are listed on this platform?",
      a: "We list a wide variety of career opportunities including internships (remote and on-site), full-time and part-time jobs, scholarships, coding contests, hackathons, fellowships, workshops, and educational events. Opportunities span industries like technology, finance, healthcare, education, marketing, and design."
    },
  ];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "OpportunityHub",
        "url": "https://opp-launch-careers-hub.vercel.app",
        "description": "Discover curated internships, scholarships, jobs, contests, and career opportunities for students and professionals worldwide.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://opp-launch-careers-hub.vercel.app/opportunities?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "Rollno31 Edtech Private Limited",
        "url": "https://opp-launch-careers-hub.vercel.app",
        "logo": "https://opp-launch-careers-hub.vercel.app/favicon.ico",
        "description": "Rollno31 Edtech Private Limited operates OpportunityHub, connecting students and professionals with curated career opportunities.",
        "sameAs": []
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return (
    <>
      <SEO 
        title="OpportunityHub — Find Internships, Scholarships & Career Opportunities"
        description="Discover curated internships, scholarships, jobs, contests, and fellowships for students and professionals. Free career platform by Rollno31 Edtech."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Discover Your Next
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {' '}Opportunity
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Connect with curated internships, jobs, and scholarships tailored for students and young professionals. Your future starts here.
                </p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search opportunities, companies, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-foreground bg-background/95 border-0 focus:bg-background"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg"
                    className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  >
                    Search
                  </Button>
                </div>
              </form>

              {/* Real Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                {[
                  { icon: Briefcase, label: 'Active Opportunities', value: stats.opportunities > 0 ? `${stats.opportunities}+` : '—' },
                  { icon: GraduationCap, label: 'Scholarships', value: stats.scholarships > 0 ? `${stats.scholarships}+` : '—' },
                  { icon: Building, label: 'Companies', value: stats.companies > 0 ? `${stats.companies}+` : '—' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                How OpportunityHub Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Getting started takes less than two minutes. Here is how our platform helps you find the right career opportunity — from discovery to application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  icon: Search,
                  title: "Browse & Search",
                  description: "Explore hundreds of curated internships, jobs, scholarships, and contests. Use our advanced filters to narrow results by type, domain, location, and deadline."
                },
                {
                  step: "2",
                  icon: Target,
                  title: "Find Your Match",
                  description: "Each listing includes detailed descriptions, requirements, company information, and direct application links. Read our career blog for tips on standing out."
                },
                {
                  step: "3",
                  icon: BookOpen,
                  title: "Bookmark & Track",
                  description: "Save interesting opportunities to your bookmarks. Track deadlines and get notified when new listings match your interests and skills."
                },
                {
                  step: "4",
                  icon: Zap,
                  title: "Apply Directly",
                  description: "Click through to the original source and apply. We provide verified links to official application pages so you can submit your application with confidence."
                }
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Opportunities */}
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Featured Opportunities
                </h2>
                <p className="text-muted-foreground">Hand-picked opportunities from verified companies and organizations</p>
              </div>
              <Link to="/opportunities">
                <Button variant="outline" className="mt-4 sm:mt-0">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredOpportunities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No opportunities yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to submit an opportunity!</p>
                  {user && (
                    <Link to="/submit">
                      <Button>Submit Opportunity</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {opportunity.type}
                          </Badge>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                            {opportunity.title}
                          </h3>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {opportunity.company && (
                              <div className="flex items-center">
                                <Building className="h-4 w-4 mr-2" />
                                {opportunity.company}
                              </div>
                            )}
                            {opportunity.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {opportunity.location}
                              </div>
                            )}
                            {opportunity.deadline && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {opportunity.tags && opportunity.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {opportunity.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {opportunity.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{opportunity.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        <Link to={`/opportunities/${opportunity.id}`}>
                          <Button className="w-full">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Opportunity Categories */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Explore Opportunity Categories
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you are a student looking for your first internship or a professional seeking a career change, we have opportunities across every major industry and domain.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Internships", desc: "Remote & on-site", icon: Briefcase, href: "/opportunities" },
                { label: "Scholarships", desc: "Financial aid", icon: GraduationCap, href: "/scholarships" },
                { label: "Tech Jobs", desc: "Software & IT", icon: Zap, href: "/opportunities" },
                { label: "Contests", desc: "Hackathons & more", icon: Star, href: "/opportunities" },
                { label: "Fellowships", desc: "Research & grants", icon: Globe, href: "/opportunities" },
                { label: "Career Tips", desc: "Blog & guides", icon: BookOpen, href: "/blog" },
              ].map((cat, i) => (
                <Link key={i} to={cat.href}>
                  <Card className="text-center hover:shadow-md transition-shadow hover:border-primary/50 cursor-pointer h-full">
                    <CardContent className="p-4">
                      <cat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold text-sm text-foreground">{cat.label}</h3>
                      <p className="text-xs text-muted-foreground">{cat.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Why Choose OpportunityHub?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We are more than a job board. OpportunityHub is a comprehensive career platform built specifically for students and early-career professionals who want to get ahead.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: CheckCircle,
                  title: 'Verified & Moderated Listings',
                  description: 'Every opportunity goes through our moderation pipeline. We verify company details, check for accuracy, and remove expired or fraudulent postings to protect our users.'
                },
                {
                  icon: TrendingUp,
                  title: 'Career Growth Resources',
                  description: 'Access 20+ original career articles covering interview preparation, resume writing, salary negotiation, and industry-specific advice written by career professionals.'
                },
                {
                  icon: Shield,
                  title: 'Privacy & Security First',
                  description: 'Your data is protected with industry-standard encryption. We comply with GDPR and CCPA regulations. You control what information you share and can delete your account anytime.'
                },
                {
                  icon: Search,
                  title: 'Powerful Search & Filters',
                  description: 'Find exactly what you need with filters for opportunity type, industry domain, location, deadline, salary range, and experience level. Save searches for quick access later.'
                },
                {
                  icon: Sparkles,
                  title: 'Resume Builder Tool',
                  description: 'Create a professional resume directly on the platform using our guided builder. Tailored templates help you highlight the right skills for each opportunity you apply to.'
                },
                {
                  icon: Heart,
                  title: 'Completely Free',
                  description: 'All features — browsing, bookmarking, notifications, career insights, and the resume builder — are free. We are supported by non-intrusive advertising so the platform stays accessible to all.'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about using OpportunityHub. Can't find an answer? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <h3 className="font-semibold text-foreground text-sm md:text-base">{faq.q}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5">
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/faq">
                <Button variant="outline">
                  View All FAQs <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section - Static SEO content */}
        <section className="py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                About OpportunityHub
              </h2>
            </div>
            <div className="prose max-w-none text-muted-foreground space-y-4 text-center">
              <p className="leading-relaxed">
                OpportunityHub is a career opportunity aggregation platform created by <strong className="text-foreground">Rollno31 Edtech Private Limited</strong>, 
                an education technology company based in India. Our mission is to bridge the gap between talented individuals and the opportunities they deserve. 
                We aggregate and curate internships, job openings, scholarships, contests, fellowships, and workshops from hundreds of verified sources across industries.
              </p>
              <p className="leading-relaxed">
                Unlike generic job boards, OpportunityHub is specifically designed for students and early-career professionals. We combine curated opportunity 
                listings with educational content — including our Career Insights blog with articles on interview preparation, resume optimization, salary 
                negotiation strategies, and industry trends. Every listing is moderated by our team to ensure quality and authenticity.
              </p>
              <p className="leading-relaxed">
                The platform is completely free to use. We sustain our operations through advertising, which allows us to keep all features — including 
                advanced search, bookmarking, notifications, and the resume builder — accessible to everyone at no cost.
              </p>
            </div>
            <div className="text-center mt-6">
              <Link to="/about">
                <Button variant="outline">
                  Learn More About Us <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-12 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Launch Your Career?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our growing community of students and young professionals. Create your free account today and start discovering opportunities tailored to your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Get Started Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/opportunities">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    Browse Opportunities
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
