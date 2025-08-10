
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Calendar, 
  Building, 
  ExternalLink, 
  Search,
  Bookmark,
  BookmarkCheck,
  Eye,
  Loader2,
  Filter,
  GraduationCap
} from 'lucide-react';

const Scholarships = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  
  const { opportunities, loading } = useOpportunities({
    type: 'Scholarship',
    search: searchTerm,
    domain: selectedDomain || undefined
  });

  const { bookmarks, toggleBookmark } = useBookmarks();

  const domains = ['Tech', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Engineering'];

  const scholarships = opportunities.filter(opp => opp.type === 'Scholarship');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find scholarships and funding opportunities for your education and research
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">All Fields</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              <Link to="/advanced-search">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading scholarships...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {scholarships.length} scholarships found
              </h2>
            </div>

            {/* Scholarships Grid */}
            {scholarships.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <GraduationCap className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or check back later for new scholarships.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {scholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-amber-100 text-amber-800">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Scholarship
                          </Badge>
                          {scholarship.featured && (
                            <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(scholarship.id)}
                          className="flex-shrink-0"
                        >
                          {bookmarks.includes(scholarship.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2">
                        {scholarship.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{scholarship.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {scholarship.company && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{scholarship.company}</span>
                          </div>
                        )}
                        {scholarship.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{scholarship.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-gray-500 truncate">
                          {scholarship.domain}
                        </span>
                        <div className="flex gap-2">
                          <Link to={`/opportunities/${scholarship.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                          <Button size="sm" asChild>
                            <a 
                              href={scholarship.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Apply
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Scholarships;
