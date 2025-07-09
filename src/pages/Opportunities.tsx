
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOpportunities } from '@/hooks/useOpportunities';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar,
  MapPin,
  Building,
  ExternalLink,
  Bookmark,
  Filter,
  Loader2,
  RefreshCw
} from 'lucide-react';

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  const { opportunities, loading, refetch } = useOpportunities({
    type: typeFilter !== 'All' ? typeFilter : undefined,
    search: searchTerm,
    location: locationFilter !== 'All' ? locationFilter : undefined
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internship": return "bg-blue-100 text-blue-800";
      case "Contest": return "bg-green-100 text-green-800";
      case "Event": return "bg-purple-100 text-purple-800";
      case "Scholarship": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Opportunities</h1>
            <p className="text-gray-600 mb-6">Discover internships, contests, events, and scholarships</p>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 px-4"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={refetch}
                    className="h-12 px-4"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className={`transition-all duration-300 ${
                showFilters 
                  ? 'max-h-40 opacity-100 animate-scale-in' 
                  : 'max-h-0 opacity-0 overflow-hidden'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white h-10"
                  >
                    <option value="All">All Types</option>
                    <option value="Internship">Internships</option>
                    <option value="Contest">Contests</option>
                    <option value="Event">Events</option>
                    <option value="Scholarship">Scholarships</option>
                  </select>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white h-10"
                  >
                    <option value="All">All Locations</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {opportunities.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="pt-6 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No opportunities found</h2>
              <p className="text-gray-600">
                {searchTerm || typeFilter !== 'All' || locationFilter !== 'All' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'New opportunities will appear here soon!'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity, index) => (
              <Card 
                key={opportunity.id} 
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in card-hover"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getTypeColor(opportunity.type)}>
                          {opportunity.type}
                        </Badge>
                        {opportunity.featured && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Featured
                          </Badge>
                        )}
                        {opportunity.remote_work_allowed && (
                          <Badge variant="secondary">Remote</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2">
                        <Link 
                          to={`/opportunities/${opportunity.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {opportunity.title}
                        </Link>
                      </CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {opportunity.description}
                  </CardDescription>
                  
                  <div className="space-y-2 mb-4">
                    {opportunity.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{opportunity.company}</span>
                      </div>
                    )}
                    {opportunity.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{opportunity.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {opportunity.tags && opportunity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {opportunity.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {opportunity.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{opportunity.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500 truncate">
                      {opportunity.domain}
                    </span>
                    <a 
                      href={opportunity.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="button-hover">
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

export default Opportunities;
