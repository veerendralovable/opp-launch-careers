
import React from 'react';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Building, ExternalLink, Loader2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Scholarships = () => {
  const { opportunities, loading, error } = useOpportunities({ type: 'Scholarship' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading scholarships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading scholarships: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
          </div>
          <p className="text-gray-600">
            Discover scholarship opportunities to fund your education and achieve your academic goals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {opportunities.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Scholarships Available</h2>
              <p className="text-gray-600 mb-4">
                We're constantly adding new scholarship opportunities. Check back soon!
              </p>
              <Link to="/opportunities">
                <Button>Browse All Opportunities</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {opportunities.map(opportunity => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-amber-100 text-amber-800">
                          Scholarship
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
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {opportunity.company && (
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {opportunity.company}
                          </div>
                        )}
                        {opportunity.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {opportunity.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {opportunity.description}
                  </CardDescription>
                  
                  {opportunity.tags && opportunity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <Link to={`/opportunities/${opportunity.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    <a 
                      href={opportunity.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button>
                        Apply Now
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
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
