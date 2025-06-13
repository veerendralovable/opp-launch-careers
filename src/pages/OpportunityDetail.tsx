
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Bookmark, 
  Calendar, 
  ExternalLink, 
  MapPin, 
  Building, 
  Share2,
  Clock,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

// This would normally come from your database
const mockOpportunity = {
  id: 1,
  title: "Frontend Developer Internship",
  description: `Join our dynamic team to build cutting-edge web applications using React and TypeScript. 

## What You'll Do
- Develop responsive web applications using React and TypeScript
- Collaborate with design teams to implement pixel-perfect UIs
- Work with backend teams to integrate APIs
- Participate in code reviews and agile development processes
- Learn from senior developers and contribute to meaningful projects

## Requirements
- Currently pursuing Computer Science or related field
- Strong knowledge of JavaScript, HTML, CSS
- Experience with React framework
- Familiarity with Git version control
- Good communication skills

## What We Offer
- Competitive stipend of ₹25,000/month
- Mentorship from senior developers
- Flexible working hours
- Opportunity for full-time conversion
- Access to latest development tools and technologies

## How to Apply
Submit your application through our careers page with your resume, portfolio, and a cover letter explaining why you're interested in this position.`,
  type: "Internship",
  domain: "Tech",
  location: "Remote",
  tags: ["React", "TypeScript", "Frontend", "JavaScript"],
  deadline: "2024-07-15",
  sourceUrl: "https://internshala.com/internship/detail/frontend-developer-internship-at-tech-company1703",
  company: "TechCorp",
  isBookmarked: false,
  createdAt: "2024-06-01",
  submittedBy: "Rahul Sharma, IIT Delhi",
  views: 1250,
  applications: 45
};

const relatedOpportunities = [
  {
    id: 2,
    title: "React Developer Internship",
    company: "StartupXYZ",
    type: "Internship",
    deadline: "2024-07-20"
  },
  {
    id: 3,
    title: "Full Stack Development Contest",
    company: "CodeChef",
    type: "Contest",
    deadline: "2024-06-30"
  },
  {
    id: 4,
    title: "Frontend Development Bootcamp",
    company: "TechEd",
    type: "Event",
    deadline: "2024-07-10"
  }
];

const OpportunityDetail = () => {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(mockOpportunity.isBookmarked);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleApply = () => {
    // Check if user is logged in - for now we'll just show a modal
    setShowLoginModal(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: mockOpportunity.title,
          text: mockOpportunity.description.substring(0, 100) + "...",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getTimeLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days left`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internship": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Contest": return "bg-green-100 text-green-800 border-green-200";
      case "Event": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Scholarship": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/opportunities">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getTypeColor(mockOpportunity.type)}>
                  {mockOpportunity.type}
                </Badge>
                <Badge variant="outline">{mockOpportunity.domain}</Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {mockOpportunity.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{mockOpportunity.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{mockOpportunity.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {formatDate(mockOpportunity.deadline)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium text-orange-600">
                    {getTimeLeft(mockOpportunity.deadline)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>{mockOpportunity.views} views</span>
                <span>{mockOpportunity.applications} applications</span>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Shared by {mockOpportunity.submittedBy}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleBookmark}
                className={cn(
                  "flex items-center gap-2",
                  isBookmarked && "text-blue-600 border-blue-600"
                )}
              >
                <Bookmark className={cn(
                  "h-4 w-4",
                  isBookmarked && "fill-current"
                )} />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              
              <Button 
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {mockOpportunity.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About this Opportunity</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="prose prose-gray max-w-none">
                  {mockOpportunity.description.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-gray-900">
                          {paragraph.substring(3)}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <li key={index} className="ml-4 mb-1 text-gray-700">
                          {paragraph.substring(2)}
                        </li>
                      );
                    }
                    return paragraph.trim() && (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleApply}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply on Original Site
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBookmark}
                  className="w-full"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleShare}
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with Friends
                </Button>
              </CardContent>
            </Card>

            {/* Related Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedOpportunities.map((opp) => (
                  <Link 
                    key={opp.id}
                    to={`/opportunities/${opp.id}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{opp.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{opp.company}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {opp.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(opp.deadline)}
                      </span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">💡 Application Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Tailor your resume to match the job requirements</li>
                  <li>• Research the company and mention specific details</li>
                  <li>• Highlight relevant projects and experience</li>
                  <li>• Apply early to increase your chances</li>
                </ul>
                <Link to="/tailor" className="inline-block mt-3">
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                    Use AI Resume Tailor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Login Modal - Simple implementation */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You need to login to apply for opportunities and access external links.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowLoginModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    setShowLoginModal(false);
                    // Handle login logic here
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OpportunityDetail;
