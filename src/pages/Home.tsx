import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  Sparkles
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

      setStats({
        opportunities: oppCount || 0,
        scholarships: scholarshipCount || 0,
        companies: Math.floor((oppCount || 0) * 0.3)
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

  return (
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
                Connect with thousands of internships, jobs, and scholarships tailored for students and young professionals. Your future starts here.
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

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { icon: Briefcase, label: 'Active Jobs', value: stats.opportunities.toString() },
                { icon: GraduationCap, label: 'Scholarships', value: stats.scholarships.toString() },
                { icon: Users, label: 'Students', value: '15K+' },
                { icon: Building, label: 'Companies', value: stats.companies.toString() }
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

      {/* Featured Opportunities */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Featured Opportunities
              </h2>
              <p className="text-muted-foreground">Hand-picked opportunities from top companies</p>
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

      {/* Features Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Choose OpportunityHub?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the tools and connections you need to accelerate your career
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Verified Opportunities',
                description: 'All opportunities are verified by our team to ensure authenticity and quality.'
              },
              {
                icon: TrendingUp,
                title: 'Career Growth',
                description: 'Track your applications and get insights to improve your success rate.'
              },
              {
                icon: Users,
                title: 'Community Support',
                description: 'Connect with peers and mentors in our active community forums.'
              },
              {
                icon: Search,
                title: 'Smart Matching',
                description: 'Our system matches you with relevant opportunities based on your profile.'
              },
              {
                icon: Sparkles,
                title: 'AI-Powered Tools',
                description: 'Use our AI tools to optimize your resume and application materials.'
              },
              {
                icon: Briefcase,
                title: 'Diverse Options',
                description: 'Find internships, jobs, scholarships, and more across all industries.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
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
              Join thousands of students and young professionals who have found their dream opportunities through our platform.
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
  );
};

export default Home;
