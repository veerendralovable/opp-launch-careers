
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bookmark, 
  ExternalLink, 
  Calendar,
  MapPin,
  Building,
  Search
} from "lucide-react";

const Bookmarks = () => {
  // Mock data - this would come from your database
  const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState([
    {
      id: 1,
      title: "Frontend Developer Internship",
      description: "Join our dynamic team to build cutting-edge web applications using React and TypeScript.",
      type: "Internship",
      domain: "Tech",
      location: "Remote",
      tags: ["React", "TypeScript", "Frontend"],
      deadline: "2024-07-15",
      sourceUrl: "https://internshala.com/internship/detail/frontend-developer-internship-at-tech-company1703",
      company: "TechCorp",
      bookmarkedAt: "2024-06-01"
    },
    {
      id: 2,
      title: "Google Summer of Code 2024",
      description: "Contribute to open source projects and get mentored by industry experts.",
      type: "Contest",
      domain: "Tech",
      location: "Remote",
      tags: ["Open Source", "Programming", "Mentorship"],
      deadline: "2024-06-30",
      sourceUrl: "https://summerofcode.withgoogle.com",
      company: "Google",
      bookmarkedAt: "2024-05-20"
    },
    {
      id: 3,
      title: "Women in Tech Scholarship",
      description: "Scholarship program supporting women pursuing careers in technology.",
      type: "Scholarship",
      domain: "Tech",
      location: "India",
      tags: ["Women", "Scholarship", "Tech"],
      deadline: "2024-08-01",
      sourceUrl: "https://example.com/scholarship",
      company: "TechFoundation",
      bookmarkedAt: "2024-05-25"
    }
  ]);

  const handleRemoveBookmark = (id: number) => {
    setBookmarkedOpportunities(prev => prev.filter(opp => opp.id !== id));
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

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days left`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookmarked Opportunities</h1>
              <p className="text-gray-600 mt-2">Your saved opportunities ({bookmarkedOpportunities.length})</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/opportunities">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Find More Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookmarkedOpportunities.length > 0 ? (
          <div className="space-y-6">
            {bookmarkedOpportunities.map(opportunity => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getTypeColor(opportunity.type)}>
                          {opportunity.type}
                        </Badge>
                        <Badge variant="outline">{opportunity.domain}</Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        <Link 
                          to={`/opportunities/${opportunity.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {opportunity.title}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {opportunity.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDeadline(opportunity.deadline)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Bookmarked on {opportunity.bookmarkedAt}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBookmark(opportunity.id)}
                      className="ml-4 text-blue-600"
                    >
                      <Bookmark className="h-5 w-5 fill-current" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-gray-600">
                    {opportunity.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunity.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Link to={`/opportunities/${opportunity.id}`}>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      variant="outline"
                      onClick={() => handleRemoveBookmark(opportunity.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Bookmark className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No bookmarked opportunities</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring opportunities and bookmark the ones that interest you. They'll appear here for easy access.
            </p>
            <Link to="/opportunities">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Browse Opportunities
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
