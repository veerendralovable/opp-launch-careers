
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Download, 
  Copy,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Tailor = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Mock analysis result
  const mockAnalysis = {
    matchScore: 78,
    missingSkills: ["Docker", "Kubernetes", "AWS", "MongoDB"],
    strengths: ["React", "TypeScript", "JavaScript", "Git"],
    suggestions: [
      "Add experience with containerization technologies like Docker",
      "Highlight any cloud computing projects or coursework",
      "Include specific examples of React projects with metrics",
      "Mention any database experience, even from academic projects"
    ],
    improvedBulletPoints: [
      "Developed responsive web applications using React and TypeScript, serving 10,000+ daily users",
      "Implemented RESTful APIs integration, reducing data loading time by 40%",
      "Collaborated in agile development environment using Git for version control",
      "Built reusable component library, improving development efficiency by 30%"
    ]
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setResumeFile(file);
      toast({
        title: "Resume uploaded successfully!",
        description: `${file.name} is ready for analysis.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload your resume and provide a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAnalysisResult(mockAnalysis);
      setStep(3);
      toast({
        title: "Analysis complete! 🎉",
        description: "Your resume has been analyzed against the job description.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResumeFile(null);
    setJobDescription("");
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI Resume Tailor
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized resume suggestions and match analysis using GPT-4. 
            Optimize your resume for any job description.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 hidden sm:inline">Upload</span>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 hidden sm:inline">Analyze</span>
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 hidden sm:inline">Results</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload Resume */}
        {step === 1 && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Upload className="h-6 w-6 mr-2" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload your current resume in PDF or Word format for AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Click to upload your resume
                  </p>
                  <p className="text-gray-600">PDF, DOC, or DOCX up to 10MB</p>
                </label>
              </div>
              
              {resumeFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">
                      {resumeFile.name} uploaded successfully
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!resumeFile}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Next: Add Job Description
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                Job Description
              </CardTitle>
              <CardDescription>
                Paste the job description you want to tailor your resume for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="job-description" className="text-base font-medium">
                    Job Description *
                  </Label>
                  <Textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                    className="mt-2 min-h-[200px]"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Pro Tips</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Include the complete job posting for better analysis</li>
                    <li>• Don't forget requirements, responsibilities, and nice-to-haves</li>
                    <li>• The more detailed the description, the better the suggestions</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Results */}
        {step === 3 && analysisResult && (
          <div className="space-y-6">
            {/* Match Score */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="h-6 w-6 mr-2" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {analysisResult.matchScore}%
                  </div>
                  <p className="text-gray-600">Resume Match Score</p>
                  <Progress value={analysisResult.matchScore} className="w-full max-w-md mx-auto mt-4" />
                </div>
              </CardContent>
            </Card>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.strengths.map((skill, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800 border-green-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-orange-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Missing Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improved Bullet Points */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested Bullet Points</CardTitle>
                <CardDescription>
                  AI-generated bullet points tailored for this job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.improvedBulletPoints.map((point, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between group">
                      <span className="text-gray-700 flex-1">{point}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(point);
                          toast({
                            title: "Copied to clipboard!",
                            description: "Bullet point copied successfully.",
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Analyze Another Resume
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Generate Full Resume
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Save Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Info */}
        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced GPT-4 technology analyzes your resume against job requirements
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Instant Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get detailed match scores, missing skills, and improvement suggestions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Download optimized resume or get LaTeX code for professional formatting
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tailor;
