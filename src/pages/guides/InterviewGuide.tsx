
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, XCircle, Lightbulb, FileText, Target, Clock, Users, Star } from 'lucide-react';
import SEO from '@/components/SEO';

const InterviewGuide = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Complete Interview Preparation Guide for Students & Freshers",
    "description": "Master every stage of the job interview process with this comprehensive guide covering preparation, common questions, body language, and follow-up strategies.",
    "author": { "@type": "Organization", "name": "OpportunityHub by Rollno31 Edtech" },
    "publisher": { "@type": "Organization", "name": "OpportunityHub" },
    "datePublished": "2026-01-15",
    "dateModified": "2026-03-01"
  };

  return (
    <>
      <SEO
        title="Interview Preparation Guide — Tips for Students & Freshers | OpportunityHub"
        description="Master every stage of the job interview process. Learn how to prepare, answer common questions, manage body language, and follow up effectively."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-white/20 text-white border-0">Career Guide</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Complete Interview Preparation Guide</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Everything you need to know to ace your next interview — from research and preparation to follow-up and negotiation.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Landing an interview is a significant achievement, but the real challenge begins with preparation. Whether you are a student 
              preparing for your first internship interview or a professional transitioning to a new role, this comprehensive guide will 
              walk you through every stage of the interview process. The strategies below are based on real hiring practices and feedback 
              from recruiters at leading companies across technology, finance, healthcare, and other industries.
            </p>
          </div>

          {/* Section 1 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Target className="h-5 w-5 text-primary" /></div>
                1. Research the Company Thoroughly
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Before any interview, invest at least two to three hours researching the company. Start with their official website — read the 
                "About Us" page, understand their products or services, and review their mission statement. Then move to their blog, press 
                releases, and social media profiles to understand their culture and recent developments.
              </p>
              <p className="leading-relaxed">
                Go beyond surface-level research. Read the company's annual reports if available. Check their Glassdoor reviews to understand 
                employee perspectives. Look up recent news articles about them. If they are a tech company, explore their engineering blog or 
                open-source contributions. If they are a startup, review their funding history on platforms like Crunchbase.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" /> Pro Tip
                </p>
                <p className="text-sm">
                  During the interview, reference specific details you found during research. For example: "I noticed your team recently 
                  launched [feature/product]. I am particularly interested in this because..." This demonstrates genuine interest and 
                  sets you apart from candidates who did not prepare.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
                2. Master Common Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                While every interview is different, certain questions appear consistently across industries and roles. Prepare thoughtful, 
                specific answers for the following categories. Avoid memorizing word-for-word scripts — instead, prepare key talking points 
                and practice delivering them naturally.
              </p>

              <h4 className="font-semibold text-foreground mt-4">Behavioral Questions (STAR Method)</h4>
              <p className="leading-relaxed">
                Behavioral questions ask you to describe past experiences to predict future performance. Use the STAR method: 
                <strong className="text-foreground"> Situation</strong> (set the context), 
                <strong className="text-foreground"> Task</strong> (describe your responsibility), 
                <strong className="text-foreground"> Action</strong> (explain what you did), and 
                <strong className="text-foreground"> Result</strong> (share the outcome with metrics if possible).
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /> "Tell me about a time you had to work under pressure."</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /> "Describe a situation where you had a conflict with a teammate."</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /> "Give an example of a project you led from start to finish."</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /> "Tell me about a time you failed and what you learned."</li>
              </ul>

              <h4 className="font-semibold text-foreground mt-4">Technical & Role-Specific Questions</h4>
              <p className="leading-relaxed">
                For technical roles, prepare for coding challenges, system design discussions, or case studies depending on the position. 
                For non-technical roles, expect questions about your domain expertise, problem-solving approach, and how you measure success. 
                Review the job description carefully — every requirement listed is a potential interview question.
              </p>

              <h4 className="font-semibold text-foreground mt-4">"Tell Me About Yourself"</h4>
              <p className="leading-relaxed">
                This is almost always the first question. Prepare a 60-90 second elevator pitch that covers: your current situation 
                (education or current role), your relevant experience or skills, and why you are interested in this specific opportunity. 
                Keep it professional, focused, and tailored to the role.
              </p>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Users className="h-5 w-5 text-primary" /></div>
                3. Body Language & Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Studies show that non-verbal communication accounts for a significant portion of the impression you make during an interview. 
                Even the most well-prepared answers can fall flat if your body language contradicts your words.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Do</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Maintain consistent eye contact (but do not stare)</li>
                    <li>• Sit upright with a slight forward lean showing engagement</li>
                    <li>• Offer a firm handshake at the start and end</li>
                    <li>• Smile naturally and nod to show understanding</li>
                    <li>• Speak at a moderate pace with clear articulation</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" /> Don't</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Cross your arms (signals defensiveness)</li>
                    <li>• Fidget with pens, phones, or your hair</li>
                    <li>• Look at the clock or your phone</li>
                    <li>• Slouch or lean too far back in your chair</li>
                    <li>• Interrupt the interviewer while they are speaking</li>
                  </ul>
                </div>
              </div>
              <p className="leading-relaxed mt-4">
                For virtual interviews, additional considerations apply: ensure your camera is at eye level, your background is clean and 
                professional, and your lighting illuminates your face clearly. Test your microphone and internet connection beforehand. 
                Look at the camera (not the screen) when speaking to simulate eye contact.
              </p>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Clock className="h-5 w-5 text-primary" /></div>
                4. After the Interview: Follow-Up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                What you do after the interview can be just as important as your performance during it. Within 24 hours of your interview, 
                send a personalized thank-you email to each person you spoke with. Reference specific topics discussed during the interview 
                to make your message memorable and genuine.
              </p>
              <p className="leading-relaxed">
                If you do not hear back within the timeline the recruiter mentioned, it is appropriate to send a polite follow-up email 
                after one week. Express continued interest in the role without being pushy. If you receive a rejection, respond graciously 
                and ask for feedback — many recruiters will share insights that can help you improve for future interviews.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold text-foreground mb-2">Thank-You Email Template</p>
                <p className="text-sm italic">
                  "Dear [Interviewer Name], thank you for taking the time to speak with me about the [Role Title] position at [Company]. 
                  I especially enjoyed learning about [specific topic discussed]. Our conversation reinforced my enthusiasm for the role and 
                  I am confident that my experience in [relevant skill] would allow me to contribute meaningfully to your team. I look forward 
                  to hearing from you. Best regards, [Your Name]"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Star className="h-5 w-5 text-primary" /></div>
                5. Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Arriving unprepared:</strong> Not researching the company or role signals lack of interest. 
                    Interviewers can tell immediately when a candidate has not done their homework.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Speaking negatively about previous employers:</strong> Even if your past experience was difficult, 
                    focus on what you learned rather than criticizing. This reflects emotional maturity.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Not asking questions:</strong> Always prepare 3-5 thoughtful questions for the interviewer. 
                    Questions about team culture, growth opportunities, and current challenges show genuine interest and critical thinking.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Being vague in answers:</strong> Use specific examples with quantifiable results wherever possible. 
                    "I improved efficiency" is weak; "I automated a process that reduced report generation time by 40%" is strong.
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-4 mt-12">
            <h3 className="text-xl font-bold text-foreground">Ready to Apply?</h3>
            <p className="text-muted-foreground">Browse our curated opportunities and put your interview skills to use.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/opportunities"><Button>Browse Opportunities <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
              <Link to="/guides/resume"><Button variant="outline">Resume Writing Guide <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewGuide;
