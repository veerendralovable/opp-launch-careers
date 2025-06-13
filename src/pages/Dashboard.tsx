
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookmarkIcon, 
  FileText, 
  TrendingUp, 
  Calendar,
  ExternalLink
} from "lucide-react";

const Dashboard = () => {
  // Mock data - this would come from your database
  const mockBookmarks = [
    {
      id: 1,
      title: "Frontend Developer Internship",
      type: "Internship",
      deadline: "2024-07-15",
      company: "TechCorp"
    },
    {
      id: 2,
      title: "Google Summer of Code 2024",
      type: "Contest",
      deadline: "2024-06-30",
      company: "Google"
    }
  ];

  const mockResumes = [
    {
      id: 1,
      name: "Software Engineer Resume",
      matchScore: 85,
      createdAt: "2024-06-01"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Your personalized career hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBookmarks.length}</div>
              <p className="text-xs text-muted-foreground">opportunities saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockResumes.length}</div>
              <p className="text-xs text-muted-foreground">tailored resumes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Match</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">highest match score</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookmarked Opportunities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Bookmarked Opportunities</CardTitle>
                <Link to="/bookmarks">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <CardDescription>Your saved opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockBookmarks.map(bookmark => (
                <div key={bookmark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{bookmark.title}</h4>
                    <p className="text-sm text-gray-600">{bookmark.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{bookmark.type}</Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {bookmark.deadline}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {mockBookmarks.length === 0 && (
                <p className="text-gray-500 text-center py-4">No bookmarked opportunities yet</p>
              )}
            </CardContent>
          </Card>

          {/* Resume History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resume History</CardTitle>
                <Link to="/tailor">
                  <Button variant="outline" size="sm">Tailor New</Button>
                </Link>
              </div>
              <CardDescription>Your AI-tailored resumes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{resume.name}</h4>
                    <p className="text-sm text-gray-600">Created on {resume.createdAt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-green-100 text-green-800">
                        {resume.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {mockResumes.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tailored resumes yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
