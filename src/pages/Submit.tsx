
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Link2, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Submit = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    domain: "",
    location: "",
    company: "",
    deadline: "",
    sourceUrl: "",
    tags: []
  });
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const types = ["Internship", "Contest", "Event", "Scholarship"];
  const domains = ["Tech", "Design", "Marketing", "Business", "Finance", "Healthcare", "Education"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Opportunity submitted successfully! 🎉",
        description: "Your submission is under review and will be published soon.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "",
        domain: "",
        location: "",
        company: "",
        deadline: "",
        sourceUrl: "",
        tags: []
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.description && formData.type && 
                     formData.domain && formData.deadline && formData.sourceUrl;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Submit an Opportunity
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help your fellow students by sharing internships, contests, events, and scholarships you've discovered.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Build Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Help thousands of students discover amazing opportunities
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-green-200 bg-green-50">
            <CardHeader>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Get Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your contributions will be attributed and celebrated
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Link2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Grow Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with like-minded students and professionals
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Submission Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Opportunity Details</CardTitle>
            <CardDescription>
              Please provide complete and accurate information to help students make informed decisions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Opportunity Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Frontend Developer Internship at TechCorp"
                  className="mt-2"
                  required
                />
              </div>

              {/* Type and Domain */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="type" className="text-base font-medium">
                    Type *
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select type</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="domain" className="text-base font-medium">
                    Domain *
                  </Label>
                  <select
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => handleInputChange("domain", e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select domain</option>
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Company and Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company" className="text-base font-medium">
                    Company/Organization
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="e.g., Google, Microsoft, IIT Bombay"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-base font-medium">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Mumbai, Remote, Delhi"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Provide a detailed description of the opportunity, requirements, benefits, and any other relevant information..."
                  className="mt-2 min-h-[120px]"
                  required
                />
              </div>

              {/* Deadline and Source URL */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="deadline" className="text-base font-medium">
                    Application Deadline *
                  </Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sourceUrl" className="text-base font-medium">
                    Source URL *
                  </Label>
                  <div className="relative mt-2">
                    <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="sourceUrl"
                      type="url"
                      value={formData.sourceUrl}
                      onChange={(e) => handleInputChange("sourceUrl", e.target.value)}
                      placeholder="https://internshala.com/internship/..."
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-base font-medium">Tags</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Add relevant skills, technologies, or keywords to help students find this opportunity
                </p>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="e.g., React, Design, Python"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Opportunity"}
                </Button>
                <p className="text-sm text-gray-600 text-center mt-3">
                  By submitting, you agree that the information is accurate and you have the right to share this opportunity.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
