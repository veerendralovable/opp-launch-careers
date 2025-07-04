
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, GraduationCap, Upload, Users, TrendingUp, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to <span className="text-blue-600">OpportunityHub</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover thousands of internships, jobs, and scholarships tailored for students and professionals. 
              Your next opportunity is just a click away.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
              <Link to="/opportunities">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Opportunities
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="w-full sm:w-auto mt-3 sm:mt-0">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything You Need</h2>
          <p className="mt-4 text-xl text-gray-600">Comprehensive tools to find and secure your next opportunity</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <CardTitle>Job Opportunities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Discover thousands of internships and full-time positions across various domains and industries.
              </CardDescription>
              <Link to="/opportunities" className="block mt-4">
                <Button variant="outline" className="w-full">Explore Jobs</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-amber-600" />
                <CardTitle>Scholarships</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find scholarship opportunities to fund your education and achieve your academic goals.
              </CardDescription>
              <Link to="/scholarships" className="block mt-4">
                <Button variant="outline" className="w-full">Find Scholarships</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Upload className="h-8 w-8 text-green-600" />
                <CardTitle>Submit Opportunities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share opportunities with the community and help others discover new possibilities.
              </CardDescription>
              <Link to="/submit" className="block mt-4">
                <Button variant="outline" className="w-full">Submit Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="flex items-center justify-center">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mt-4 text-3xl font-bold text-gray-900">1000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="mt-4 text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Opportunities Posted</p>
            </div>
            <div>
              <div className="flex items-center justify-center">
                <Star className="h-12 w-12 text-amber-600" />
              </div>
              <h3 className="mt-4 text-3xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Find Your Next Opportunity?</h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of students and professionals who have found success through OpportunityHub.
          </p>
          <div className="mt-8">
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                Sign Up Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
