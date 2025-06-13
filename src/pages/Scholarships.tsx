
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Search, 
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  User
} from "lucide-react";

const Scholarships = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: "",
    location: "",
    gender: "",
    category: "",
    interests: ""
  });
  const [showResults, setShowResults] = useState(false);

  // Mock scholarship data
  const mockScholarships = [
    {
      id: 1,
      title: "Women in Technology Scholarship",
      provider: "TechFoundation",
      amount: "₹1,00,000",
      deadline: "2024-08-15",
      location: "India",
      eligibility: "Female students in Computer Science/IT",
      description: "Supporting women pursuing careers in technology fields.",
      tags: ["Women", "Technology", "Engineering"],
      sourceUrl: "https://example.com/women-tech-scholarship"
    },
    {
      id: 2,
      title: "Merit Scholarship for Engineering Students",
      provider: "Education Trust",
      amount: "₹50,000",
      deadline: "2024-07-30",
      location: "Mumbai",
      eligibility: "Engineering students with 80%+ marks",
      description: "Merit-based scholarship for outstanding engineering students.",
      tags: ["Merit", "Engineering", "Academic Excellence"],
      sourceUrl: "https://example.com/merit-scholarship"
    },
    {
      id: 3,
      title: "Rural Area Student Support Scholarship",
      provider: "Government of India",
      amount: "₹75,000",
      deadline: "2024-09-01",
      location: "All India",
      eligibility: "Students from rural backgrounds",
      description: "Supporting students from rural areas to pursue higher education.",
      tags: ["Rural", "Government", "Support"],
      sourceUrl: "https://example.com/rural-scholarship"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowResults(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Scholarship Matcher</h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Find scholarships tailored to your profile. Fill out the form below to get personalized scholarship recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
          /* Profile Form */
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2" />
                Tell Us About Yourself
              </CardTitle>
              <CardDescription>
                Provide your details to get matched with relevant scholarships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      value={formData.college}
                      onChange={(e) => handleInputChange("college", e.target.value)}
                      placeholder="Enter your college name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch/Field of Study</Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => handleInputChange("branch", e.target.value)}
                      placeholder="e.g., Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Current Year</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                      placeholder="e.g., 2nd Year"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location/State</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter your state"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      placeholder="Enter your gender"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category (if applicable)</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="e.g., SC/ST/OBC/General"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="interests">Areas of Interest/Career Goals</Label>
                  <Input
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => handleInputChange("interests", e.target.value)}
                    placeholder="e.g., AI/ML, Web Development, Data Science"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Find Matching Scholarships
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Scholarship Results */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Scholarship Matches</h2>
                <p className="text-gray-600">Found {mockScholarships.length} scholarships matching your profile</p>
              </div>
              <Button 
                onClick={() => setShowResults(false)}
                variant="outline"
              >
                Update Profile
              </Button>
            </div>

            {mockScholarships.map(scholarship => (
              <Card key={scholarship.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{scholarship.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {scholarship.provider}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {scholarship.amount}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {scholarship.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDeadline(scholarship.deadline)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-gray-600">
                    {scholarship.description}
                  </CardDescription>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Eligibility:</p>
                    <p className="text-sm text-gray-600">{scholarship.eligibility}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {scholarship.tags.map((tag, index) => (
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
                    <Button variant="outline">
                      Save for Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scholarships;
