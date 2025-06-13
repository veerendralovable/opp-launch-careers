
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye,
  Trash2,
  Calendar,
  MapPin,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Mock data - this would come from your database
  const mockSubmissions = [
    {
      id: 1,
      title: "UI/UX Design Internship",
      description: "Design user interfaces for mobile applications...",
      type: "Internship",
      domain: "Design",
      location: "Bangalore",
      tags: ["UI/UX", "Figma", "Mobile"],
      deadline: "2024-07-20",
      sourceUrl: "https://example.com/design-internship",
      company: "DesignStudio",
      submittedBy: "user123",
      submittedAt: "2024-06-10",
      status: "pending",
      submitterName: "Priya Sharma"
    },
    {
      id: 2,
      title: "Data Science Competition",
      description: "Solve real-world data problems...",
      type: "Contest",
      domain: "Tech",
      location: "Remote",
      tags: ["Machine Learning", "Python", "Data"],
      deadline: "2024-08-15",
      sourceUrl: "https://kaggle.com/competition",
      company: "DataCorp",
      submittedBy: "user456",
      submittedAt: "2024-06-08",
      status: "approved",
      submitterName: "Rahul Kumar"
    }
  ];

  const statuses = ["All", "pending", "approved", "rejected"];

  const handleApprove = (id: number) => {
    console.log(`Approving opportunity ${id}`);
    // Update status in database
  };

  const handleReject = (id: number) => {
    console.log(`Rejecting opportunity ${id}`);
    // Update status in database
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting opportunity ${id}`);
    // Delete from database
  };

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || submission.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage submitted opportunities</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button variant="outline">
                Export Data
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Analytics
              </Button>
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
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                  <div className="space-y-2">
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors capitalize",
                          selectedStatus === status
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions List */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredSubmissions.length} submissions
              </p>
            </div>

            <div className="space-y-6">
              {filteredSubmissions.map(submission => (
                <Card key={submission.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                          <Badge className={getTypeColor(submission.type)}>
                            {submission.type}
                          </Badge>
                          <Badge variant="outline">{submission.domain}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">
                          {submission.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {submission.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {submission.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Deadline: {submission.deadline}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Submitted by: <strong>{submission.submitterName}</strong> on {submission.submittedAt}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {submission.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {submission.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {submission.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleApprove(submission.id)}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(submission.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleDelete(submission.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find more submissions.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("All");
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

export default Admin;
