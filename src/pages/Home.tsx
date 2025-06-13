
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Users, Target, ArrowRight, Sparkles, BookOpen, TrendingUp } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Tailor your Resume with AI",
      description: "Get personalized resume suggestions and match analysis for any job description using GPT-4.",
      link: "/tailor"
    },
    {
      icon: Search,
      title: "Search Across All Platforms",
      description: "Find internships, contests, and scholarships from multiple platforms in one place.",
      link: "/opportunities"
    },
    {
      icon: Users,
      title: "Share Opportunities Easily",
      description: "Submit and share opportunities with the student community to help others grow.",
      link: "/submit"
    }
  ];

  const stats = [
    { number: "500+", label: "Opportunities" },
    { number: "10k+", label: "Students Helped" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Universities" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find the Right Opportunity.{" "}
              <span className="text-blue-600">Instantly.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Curated internships, contests, and scholarships for every student. 
              Powered by AI to accelerate your career journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/opportunities">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 rounded-full">
                  Browse Opportunities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/tailor">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3 rounded-full">
                  Try AI Resume Tool
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to accelerate your career
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From finding the perfect opportunity to crafting the ideal resume, 
              we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {feature.description}
                  </CardDescription>
                  <Link to={feature.link}>
                    <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Opportune Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to supercharge your career
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover</h3>
              <p className="text-gray-600">
                Browse curated opportunities from top platforms like Internshala, Unstop, and more.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Optimize</h3>
              <p className="text-gray-600">
                Use our AI-powered resume tailor to match your profile perfectly with job requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply</h3>
              <p className="text-gray-600">
                Apply with confidence knowing your resume is tailored and your profile stands out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to accelerate your career?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students who have found their dream opportunities through Opportune.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/opportunities">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3 rounded-full">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/tailor">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 rounded-full border-white text-white hover:bg-white hover:text-blue-600">
                Try AI Tool Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
