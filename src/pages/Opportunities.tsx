import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Bookmark, 
  ExternalLink, 
  Calendar,
  MapPin,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - this would come from your database
const mockOpportunities = [
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
    isBookmarked: false,
    createdAt: "2024-06-01"
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
    isBookmarked: true,
    createdAt: "2024-05-15"
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
    isBookmarked: false,
    createdAt: "2024-05-20"
  },
  {
    id: 4,
    title: "Design Thinking Workshop",
    description: "Learn design thinking methodologies from industry professionals.",
    type: "Event",
    domain: "Design",
    location: "Mumbai",
    tags: ["Design", "Workshop", "UX"],
    deadline: "2024-06-25",
    sourceUrl: "https://unstop.com/events/design-workshop",
    company: "DesignHub",
    isBookmarked: false,
    createdAt: "2024-06-05"
  }
];

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [opportunities, setOpportunities] = useState(mockOpportunities);

  const types = ["All", "Internship", "Contest", "Event", "Scholarship"];
  const domains = ["All", "Tech", "Design", "Marketing", "Business", "Finance"];

  const handleBookmark = (id: number) => {
    setOpportunities(prev => 
      prev.map(opp => 
        opp.id === id ? { ...opp, isBookmarked: !opp.isBookmarked } : opp
      )
    );
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "All" || opp.type === selectedType;
    const matchesDomain = selectedDomain === "All" || opp.domain === selectedDomain;
    
    return matchesSearch && matchesType && matchesDomain;
  });

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
              <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
              <p className="text-gray-600 mt-2">Discover internships, contests, events, and scholarships</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/submit">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Submit Opportunity
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search opportunities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                  <div className="space-y-2">
                    {types.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          selectedType === type
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Domain Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Domain</label>
                  <div className="space-y-2">
                    {domains.map(domain => (
                      <button
                        key={domain}
                        onClick={() => setSelectedDomain(domain)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          selectedDomain === domain
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Opportunities Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredOpportunities.length} opportunities
              </p>
            </div>

            <div className="space-y-6">
              {filteredOpportunities.map(opportunity => (
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
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(opportunity.id)}
                        className={cn(
                          "ml-4",
                          opportunity.isBookmarked && "text-blue-600"
                        )}
                      >
                        <Bookmark className={cn(
                          "h-5 w-5",
                          opportunity.isBookmarked && "fill-current"
                        )} />
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find more opportunities.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("All");
                    setSelectedDomain("All");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
