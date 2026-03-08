
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';

const faqCategories = [
  {
    title: "Getting Started",
    faqs: [
      {
        q: "What is OpportunityHub?",
        a: "OpportunityHub is a free career opportunity aggregation platform operated by Rollno31 Edtech Private Limited. We curate and list internships, jobs, scholarships, contests, fellowships, and workshops from verified third-party sources across India and globally. Our goal is to make it easier for students and early-career professionals to discover opportunities in one centralized place."
      },
      {
        q: "Is OpportunityHub free to use?",
        a: "Yes, OpportunityHub is completely free for all users. All features — including browsing opportunities, advanced search and filters, bookmarking, real-time notifications, our Career Insights blog, and the resume builder — are available at no cost. We sustain the platform through non-intrusive advertising."
      },
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button on the top-right corner or visit the authentication page. You can register using your email address and a password. Once registered, you can complete your profile with your skills, education, and experience to get the most out of the platform."
      },
      {
        q: "Do I need an account to browse opportunities?",
        a: "No, you can browse all opportunities, read blog articles, and use the search functionality without an account. However, creating a free account unlocks features like bookmarking opportunities, receiving notifications, submitting opportunities, and using the resume builder."
      },
    ]
  },
  {
    title: "Opportunities & Listings",
    faqs: [
      {
        q: "What types of opportunities are listed on OpportunityHub?",
        a: "We list a wide variety of career opportunities including internships (remote and on-site), full-time and part-time jobs, scholarships, coding contests, hackathons, fellowships, workshops, and educational events. Opportunities span industries like technology, finance, healthcare, education, marketing, design, and more."
      },
      {
        q: "How are opportunities verified before being listed?",
        a: "Every opportunity submitted to our platform goes through a moderation process. Our team reviews each listing for authenticity, accuracy, and relevance before it becomes publicly visible. We source opportunities from official company career pages, reputable job boards, and verified organizations to ensure quality and protect our users from fraudulent listings."
      },
      {
        q: "How often are new opportunities added?",
        a: "New opportunities are added daily. Our team continuously curates and reviews submissions from multiple sources. We recommend enabling notifications or checking back regularly to stay updated on the latest listings."
      },
      {
        q: "Can I submit an opportunity from my organization?",
        a: "Absolutely! Any registered user can submit opportunities through the 'Submit Opportunity' page. Once submitted, your listing enters our moderation queue where it is reviewed for accuracy and compliance with our guidelines. Approved listings typically go live within 24 hours."
      },
      {
        q: "Does OpportunityHub directly offer jobs or internships?",
        a: "No. OpportunityHub is an aggregation platform that curates opportunities from third-party sources. We do not directly offer employment, internships, or scholarships. All listings are sourced from publicly available information and official company career pages. Users should verify all details with the original source before applying."
      },
    ]
  },
  {
    title: "Features & Tools",
    faqs: [
      {
        q: "How do I search for specific opportunities?",
        a: "Use the search bar on the home page or the Opportunities page. You can search by keywords, company name, or skills. For more refined results, use our Advanced Search page which offers filters for opportunity type, industry domain, location, deadline, salary range, and experience level."
      },
      {
        q: "How do bookmarks work?",
        a: "When you find an opportunity you are interested in, click the bookmark icon to save it to your profile. You can access all your bookmarked opportunities from your dashboard. Bookmarks help you keep track of opportunities you want to apply to and manage your application deadlines."
      },
      {
        q: "What is the Career Insights blog?",
        a: "Our Career Insights blog features 20+ original articles written by career professionals covering topics like interview preparation, resume writing best practices, salary negotiation strategies, industry trends, and career development advice. The blog is freely accessible and designed to help you stand out in competitive application processes."
      },
      {
        q: "Is there a resume builder on the platform?",
        a: "Yes, OpportunityHub includes a guided resume builder that helps you create a professional resume. The tool provides structured templates and helps you highlight the right skills, experience, and education for the roles you are targeting."
      },
      {
        q: "How do notifications work?",
        a: "After creating your free account, you can enable real-time notifications from your dashboard. You will receive alerts when new opportunities matching your interests are posted. You can manage notification preferences from your profile settings."
      },
    ]
  },
  {
    title: "Privacy & Security",
    faqs: [
      {
        q: "How is my personal data protected?",
        a: "We use industry-standard TLS encryption for all data transmission, secure cloud infrastructure with regular security audits, and password hashing using bcrypt. We comply with GDPR and CCPA regulations. You control what information you share and can delete your account and all associated data at any time."
      },
      {
        q: "Does OpportunityHub use cookies?",
        a: "Yes, we use essential cookies for login and security, analytics cookies (Google Analytics) to understand usage patterns, and advertising cookies (Google AdSense) to display relevant ads. You can manage your cookie preferences through the consent banner that appears on your first visit or through your browser settings."
      },
      {
        q: "Can I delete my account and data?",
        a: "Yes. You have the right to request deletion of your account and all associated personal data at any time. Contact our support team or use the account settings page to initiate the process. We process deletion requests promptly in compliance with applicable data protection laws."
      },
    ]
  },
  {
    title: "Support & Contact",
    faqs: [
      {
        q: "How can I report a problem or a fraudulent listing?",
        a: "If you encounter a fraudulent or inaccurate listing, please contact us through the Contact page. Provide the listing URL and details about the issue. Our moderation team will investigate and take appropriate action, including removing the listing if necessary."
      },
      {
        q: "How can I contact OpportunityHub for other inquiries?",
        a: "You can reach us through the Contact page on our website. Select the appropriate category (General Inquiry, Technical Support, Business Partnership, Feedback, or Bug Report) and submit your message. We typically respond within 24 hours."
      },
      {
        q: "Who operates OpportunityHub?",
        a: "OpportunityHub is a product of Rollno31 Edtech Private Limited, an education technology company based in India. Our team is dedicated to connecting students and professionals with quality career opportunities and providing the resources they need to succeed."
      },
    ]
  }
];

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const allFaqs = faqCategories.flatMap(cat => cat.faqs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return (
    <>
      <SEO 
        title="FAQ — Frequently Asked Questions | OpportunityHub"
        description="Find answers to common questions about OpportunityHub. Learn about our career opportunity platform, features, privacy, and how to get started."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Everything you need to know about using OpportunityHub. Can't find an answer? <Link to="/contact" className="underline hover:text-white">Contact us</Link>.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">{category.title}</h2>
              <div className="space-y-3">
                {category.faqs.map((faq, faqIdx) => {
                  const key = `${catIdx}-${faqIdx}`;
                  return (
                    <Card key={key} className="overflow-hidden">
                      <button
                        className="w-full text-left p-5 flex items-center justify-between gap-4"
                        onClick={() => setOpenFaq(openFaq === key ? null : key)}
                      >
                        <h3 className="font-semibold text-foreground text-sm md:text-base">{faq.q}</h3>
                        {openFaq === key ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </button>
                      {openFaq === key && (
                        <div className="px-5 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="text-center mt-8 space-y-4">
            <p className="text-muted-foreground">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button>Contact Us <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </Link>
              <Link to="/help-center">
                <Button variant="outline">Help Center <ArrowRight className="h-4 w-4 ml-2" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
