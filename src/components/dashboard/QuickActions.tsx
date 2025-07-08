
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Award, FileText, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const quickActions = [
    {
      title: "Browse Opportunities",
      description: "Find new internships and jobs",
      icon: Target,
      link: "/opportunities",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Scholarships",
      description: "Discover funding opportunities",
      icon: Award,
      link: "/scholarships",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Build Resume",
      description: "Create professional resumes",
      icon: FileText,
      link: "/resume-builder",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Submit Opportunity",
      description: "Share opportunities with others",
      icon: Send,
      link: "/submit",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="lg:col-span-2">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base md:text-lg">
                <div className={`p-2 md:p-3 rounded-lg transition-all duration-300 group-hover:scale-110 ${action.color}`}>
                  <action.icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{action.description}</p>
              <Link to={action.link}>
                <Button className="w-full transition-all duration-300 hover:scale-105">
                  {action.title}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
