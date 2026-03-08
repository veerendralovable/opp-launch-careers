
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, FileText, GraduationCap, Users, Briefcase, TrendingUp } from 'lucide-react';
import SEO from '@/components/SEO';

const guides = [
  {
    title: "Complete Interview Preparation Guide",
    description: "Master every stage of the job interview process — from research and preparation to body language, common questions (with the STAR method), and professional follow-up strategies.",
    icon: Users,
    href: "/guides/interview",
    badge: "Most Popular",
    readTime: "12 min read"
  },
  {
    title: "How to Write a Winning Resume",
    description: "Step-by-step guide to creating a professional resume that passes ATS screening. Covers format selection, essential sections, keyword optimization, and common mistakes to avoid.",
    icon: FileText,
    href: "/guides/resume",
    badge: "Essential",
    readTime: "10 min read"
  },
  {
    title: "How to Find & Win Scholarships",
    description: "Navigate the scholarship landscape with confidence. Learn about types of scholarships, where to find them, how to write compelling essays, and how to avoid scholarship scams.",
    icon: GraduationCap,
    href: "/guides/scholarship",
    badge: "Students",
    readTime: "11 min read"
  },
];

const Guides = () => {
  return (
    <>
      <SEO
        title="Career Guides — Interview Tips, Resume Writing & Scholarship Advice | OpportunityHub"
        description="Free career guides covering interview preparation, resume writing, scholarship applications, and more. Expert advice for students and early-career professionals."
      />
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Guides</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              In-depth, expert-written guides to help you navigate every stage of your career journey — from writing your first resume to acing your dream interview.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-6">
            {guides.map((guide, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-primary/10 rounded-xl w-16 h-16 flex items-center justify-center">
                        <guide.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{guide.badge}</Badge>
                        <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        <Link to={guide.href}>{guide.title}</Link>
                      </h2>
                      <p className="text-muted-foreground mb-4 leading-relaxed">{guide.description}</p>
                      <Link to={guide.href}>
                        <Button variant="outline" size="sm">
                          Read Guide <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">More Career Resources</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              In addition to these guides, explore our Career Insights blog for 20+ articles on interview tips, salary negotiation, 
              industry trends, and professional development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blog"><Button>Career Insights Blog <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/opportunities"><Button variant="outline">Browse Opportunities <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/faq"><Button variant="outline">FAQ <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guides;
