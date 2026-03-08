
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, XCircle, Lightbulb, FileText, Layout, Target, Zap, Star } from 'lucide-react';
import SEO from '@/components/SEO';

const ResumeGuide = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Write a Winning Resume — Complete Guide for Students & Freshers",
    "description": "Step-by-step resume writing guide covering format, sections, keywords, common mistakes, and ATS optimization for students and early-career professionals.",
    "author": { "@type": "Organization", "name": "OpportunityHub by Rollno31 Edtech" },
    "publisher": { "@type": "Organization", "name": "OpportunityHub" },
    "datePublished": "2026-01-20",
    "dateModified": "2026-03-01"
  };

  return (
    <>
      <SEO
        title="Resume Writing Guide — How to Write a Winning Resume | OpportunityHub"
        description="Learn how to write a professional resume that gets noticed. Step-by-step guide covering format, ATS optimization, keywords, and common mistakes to avoid."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-white/20 text-white border-0">Career Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Write a Winning Resume</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              A step-by-step guide to creating a resume that passes ATS screening and impresses hiring managers.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your resume is often the first impression a potential employer has of you. In today's competitive job market, recruiters spend 
              an average of just 6-7 seconds scanning a resume before deciding whether to continue reading. For students and freshers, crafting 
              a resume that stands out — even without years of professional experience — requires strategy, precision, and an understanding 
              of what hiring managers and Applicant Tracking Systems (ATS) are looking for. This guide will walk you through every aspect 
              of building a resume that gets results.
            </p>
          </div>

          {/* Section 1: Format */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Layout className="h-5 w-5 text-primary" /></div>
                1. Choose the Right Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                There are three main resume formats, and choosing the right one depends on your experience level and career goals:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Reverse Chronological</h4>
                  <p className="text-sm">Lists experience from most recent first. Best for professionals with a solid work history. This is the most common format and what most recruiters expect.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border-2 border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">Functional (Skills-Based)</h4>
                  <p className="text-sm">Organizes by skills rather than timeline. Best for students, career changers, or those with gaps. Highlights what you can do rather than when you did it.</p>
                  <Badge className="mt-2" variant="secondary">Recommended for Students</Badge>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Combination</h4>
                  <p className="text-sm">Blends both approaches. Leads with a skills summary followed by chronological experience. Good for those with some work experience plus strong skills.</p>
                </div>
              </div>
              <p className="leading-relaxed">
                For most students and freshers, a functional or combination format works best. It allows you to lead with your strengths — 
                academic projects, technical skills, internships, and extracurricular activities — rather than highlighting a short work history.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Essential Sections */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
                2. Essential Resume Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
                <p className="leading-relaxed">
                  Include your full name, professional email address (avoid nicknames — use firstname.lastname@email.com), phone number, 
                  city and state (full address is no longer required), LinkedIn profile URL, and optionally your GitHub or portfolio website.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Professional Summary or Objective</h4>
                <p className="leading-relaxed">
                  Write a 2-3 sentence summary that highlights your key qualifications and career goals. For students, focus on your 
                  academic achievements, relevant coursework, and the value you bring. Avoid generic statements like "hardworking and motivated 
                  individual" — instead, be specific: "Computer Science student with hands-on experience in React and Python, seeking a 
                  software engineering internship to apply full-stack development skills in a collaborative environment."
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Education</h4>
                <p className="leading-relaxed">
                  For students and recent graduates, education should come before work experience. Include your degree, university name, 
                  graduation date (or expected), GPA (if above 3.5 or equivalent), relevant coursework, academic honors, and any notable 
                  projects completed during your studies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Experience</h4>
                <p className="leading-relaxed">
                  Include internships, part-time jobs, freelance work, and volunteer experience. For each entry, use bullet points starting 
                  with strong action verbs (designed, developed, managed, implemented, led, analyzed). Quantify results wherever possible — 
                  numbers make your impact tangible and memorable.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Skills</h4>
                <p className="leading-relaxed">
                  Divide into categories: Technical Skills (programming languages, tools, frameworks), Soft Skills (communication, teamwork, 
                  leadership), and Certifications. Tailor this section to match the job description — many ATS systems scan for specific 
                  keywords from the posting.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: ATS Optimization */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Zap className="h-5 w-5 text-primary" /></div>
                3. ATS Optimization (Critical for Online Applications)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Over 90% of large companies use Applicant Tracking Systems (ATS) to filter resumes before a human ever sees them. If your 
                resume is not ATS-friendly, it may be automatically rejected regardless of your qualifications. Here is how to optimize:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Use standard section headings:</strong> "Experience," "Education," "Skills" — not creative 
                    alternatives like "My Journey" or "What I Bring to the Table." ATS software looks for standard headings.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Include keywords from the job description:</strong> If the posting mentions "React.js," 
                    "data analysis," or "project management," use those exact phrases in your resume where truthful.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Avoid graphics, tables, and columns:</strong> Many ATS systems cannot parse complex layouts. 
                    Use a clean, single-column format with standard fonts (Arial, Calibri, Times New Roman).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Submit as PDF (unless otherwise specified):</strong> PDF preserves formatting across devices. 
                    Some companies specifically request .docx files — always follow their instructions.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Common Mistakes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Star className="h-5 w-5 text-primary" /></div>
                4. Common Resume Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-foreground">Typos and grammatical errors:</strong> A single typo can disqualify you. Proofread multiple times and ask someone else to review.</div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-foreground">Using a generic resume for every application:</strong> Tailor your resume for each role by adjusting your summary, skills, and highlighted experience to match the job description.</div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-foreground">Including irrelevant information:</strong> Your resume is not your autobiography. Only include experiences and skills relevant to the target role. Leave out high school details if you are in college.</div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-foreground">Making it too long:</strong> For students and early-career professionals, one page is the standard. Only exceed this if you have extensive relevant experience.</div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div><strong className="text-foreground">Listing duties instead of achievements:</strong> "Responsible for managing social media" is a duty. "Grew Instagram following by 150% in 6 months through targeted content strategy" is an achievement.</div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" /> Action Verb Cheat Sheet
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="font-medium text-foreground mb-1">Leadership</p>
                <p>Led, Managed, Directed, Coordinated, Supervised</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Technical</p>
                <p>Developed, Engineered, Programmed, Automated, Deployed</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Creative</p>
                <p>Designed, Created, Launched, Produced, Innovated</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Analytical</p>
                <p>Analyzed, Evaluated, Researched, Assessed, Optimized</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 mt-12">
            <h3 className="text-xl font-bold text-foreground">Build Your Resume Now</h3>
            <p className="text-muted-foreground">Use our free resume builder or browse opportunities to apply with your new resume.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/opportunities"><Button>Browse Opportunities <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/guides/interview"><Button variant="outline">Interview Prep Guide <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeGuide;
