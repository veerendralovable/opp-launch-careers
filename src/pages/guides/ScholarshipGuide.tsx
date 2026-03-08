
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Lightbulb, GraduationCap, Search, FileText, Globe, Calendar, AlertTriangle } from 'lucide-react';
import SEO from '@/components/SEO';

const ScholarshipGuide = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Complete Scholarship Application Guide — How to Find & Win Scholarships",
    "description": "Learn how to find, apply for, and win scholarships. Covers types of scholarships, application strategies, essay writing, and avoiding scams.",
    "author": { "@type": "Organization", "name": "OpportunityHub by Rollno31 Edtech" },
    "publisher": { "@type": "Organization", "name": "OpportunityHub" },
    "datePublished": "2026-02-01",
    "dateModified": "2026-03-01"
  };

  return (
    <>
      <SEO
        title="Scholarship Guide — How to Find & Win Scholarships | OpportunityHub"
        description="Complete guide to finding and winning scholarships. Learn about types of scholarships, application strategies, essay writing tips, and how to avoid scams."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-white/20 text-white border-0">Career Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Find & Win Scholarships</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              A comprehensive guide to navigating the scholarship landscape — from finding the right opportunities to crafting winning applications.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Scholarships are one of the most effective ways to fund your education without taking on debt. Every year, billions of dollars 
              in scholarship money are available across thousands of programs — yet many go unclaimed because students either do not know about 
              them or do not apply. This guide will help you understand the scholarship landscape, develop a strategy for finding opportunities, 
              and craft applications that stand out from the competition.
            </p>
          </div>

          {/* Types of Scholarships */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><GraduationCap className="h-5 w-5 text-primary" /></div>
                1. Understanding Types of Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Merit-Based</h4>
                  <p className="text-sm">Awarded based on academic excellence, test scores, or exceptional talent in areas like sports, arts, or leadership. These typically require maintaining a minimum GPA.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Need-Based</h4>
                  <p className="text-sm">Awarded based on financial need demonstrated through family income documentation. Government scholarships and many institutional grants fall in this category.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Field-Specific</h4>
                  <p className="text-sm">Targeted at students pursuing specific fields of study — STEM, humanities, medicine, engineering, social sciences. Often funded by industry organizations.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Community & Identity-Based</h4>
                  <p className="text-sm">Available to specific demographic groups, community members, or students from particular regions. Includes scholarships for women in STEM, minority students, and rural students.</p>
                </div>
              </div>
              <p className="leading-relaxed">
                Many students only apply for well-known national scholarships, which tend to be highly competitive. However, local and 
                community-based scholarships often have fewer applicants and better odds. Cast a wide net — apply to as many scholarships 
                as you qualify for, regardless of the amount. Small scholarships add up significantly over time.
              </p>
            </CardContent>
          </Card>

          {/* Finding Scholarships */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Search className="h-5 w-5 text-primary" /></div>
                2. Where to Find Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Scholarship opportunities exist in more places than most students realize. Here is a comprehensive list of sources to explore:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">OpportunityHub:</strong> Our platform curates scholarship listings from across India and globally. 
                    Use the Scholarships filter on our Opportunities page to find current openings, or visit the dedicated Scholarships page.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Your college financial aid office:</strong> They maintain lists of institutional scholarships 
                    and external opportunities relevant to your school's students. Visit them early and often.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Government portals:</strong> National Scholarship Portal (NSP) in India, FAFSA in the US, 
                    and equivalent programs in other countries offer substantial funding opportunities.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Professional associations:</strong> Industry organizations (IEEE, ACM, CFA Institute, etc.) 
                    often sponsor scholarships for students in their field.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Corporate scholarships:</strong> Companies like Google, Microsoft, Tata, Infosys, and others 
                    run scholarship programs as part of their CSR initiatives.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Application Strategy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
                3. Crafting a Winning Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                A strong scholarship application goes beyond meeting minimum requirements. Selection committees review hundreds or thousands 
                of applications, so your goal is to make yours memorable and authentic.
              </p>
              <h4 className="font-semibold text-foreground">Writing the Scholarship Essay</h4>
              <p className="leading-relaxed">
                The essay is your chance to tell your story in a way that no transcript or resume can. Start with a compelling opening — 
                avoid clichés like "I have always wanted to help people." Instead, begin with a specific moment, challenge, or realization 
                that shaped your path. Be authentic and vulnerable where appropriate. Selection committees value genuine stories over polished 
                but generic narratives.
              </p>
              <p className="leading-relaxed">
                Structure your essay clearly: introduce your background and motivation, describe your achievements and challenges, explain your 
                goals and how the scholarship will help you achieve them, and close with a forward-looking statement about the impact you want 
                to make. Keep it within the word limit — going over signals an inability to follow instructions.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" /> Key Tips
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Answer the prompt directly — do not write a generic essay and repurpose it</li>
                  <li>• Show impact through specific examples and numbers when possible</li>
                  <li>• Have at least two people proofread your essay</li>
                  <li>• Start early — good essays require multiple drafts over weeks, not hours</li>
                  <li>• Connect your story to the scholarship provider's mission and values</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Calendar className="h-5 w-5 text-primary" /></div>
                4. Building a Scholarship Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Scholarship deadlines are spread throughout the year. Create a dedicated calendar or spreadsheet to track all scholarships 
                you plan to apply for. For each one, note: the deadline, required documents, essay prompts, recommendation letter requirements, 
                and submission method.
              </p>
              <p className="leading-relaxed">
                Most major scholarships have deadlines between October and March for the following academic year. However, smaller 
                scholarships may have rolling deadlines. Start searching at least 6 months before you need funding, and aim to 
                submit applications at least one week before the deadline to avoid last-minute technical issues.
              </p>
              <p className="leading-relaxed">
                On OpportunityHub, you can bookmark scholarship listings and track their deadlines directly from your dashboard. 
                Enable notifications to receive alerts when new scholarship opportunities matching your profile are posted.
              </p>
            </CardContent>
          </Card>

          {/* Avoiding Scams */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><AlertTriangle className="h-5 w-5 text-primary" /></div>
                5. Avoiding Scholarship Scams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Unfortunately, scholarship scams exist and target students who are eager for financial aid. Protect yourself by recognizing 
                these common red flags:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" /> Any scholarship that requires an upfront fee to apply is almost certainly a scam</li>
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" /> "Guaranteed" scholarships do not exist — legitimate scholarships are competitive</li>
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" /> Be wary of scholarships that ask for bank account details or credit card information</li>
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" /> Unsolicited scholarship offers via email or social media should be verified independently</li>
                <li className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" /> Always verify the scholarship provider through official channels before applying</li>
              </ul>
              <p className="leading-relaxed">
                All scholarships listed on OpportunityHub go through our moderation process. However, we always recommend verifying details 
                with the original source before submitting personal information or documents.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-4 mt-12">
            <h3 className="text-xl font-bold text-foreground">Start Your Scholarship Search</h3>
            <p className="text-muted-foreground">Browse curated scholarship opportunities on our platform.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/scholarships"><Button>Browse Scholarships <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/guides/resume"><Button variant="outline">Resume Writing Guide <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScholarshipGuide;
