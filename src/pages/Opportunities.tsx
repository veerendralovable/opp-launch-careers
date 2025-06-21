
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Calendar, MapPin, Building, ExternalLink, Heart, Search, Filter, Bookmark, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Opportunities = () => {
  const [filters, setFilters] = useState({
    type: 'All',
    domain: 'All',
    search: ''
  });

  const { opportunities, loading, error } = useOpportunities(filters);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { trackEvent } = useAnalytics();

  // Track search and filter usage
  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm });
    if (searchTerm) {
      trackEvent('search_performed', { query: searchTerm });
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({ ...filters, [filterType]: value });
    trackEvent('filter_applied', { filter_type: filterType, filter_value: value });
  };

  const handleOpportunityClick = (opportunityId: string, title: string) => {
    trackEvent('opportunity_viewed', { 
      opportunity_id: opportunityId, 
      opportunity_title: title 
    });
  };

  const handleExternalLinkClick = (opportunityId: string, url: string) => {
    trackEvent('external_link_clicked', { 
      opportunity_id: opportunityId, 
      external_url: url 
    });
  };

  const handleBookmarkClick = (opportunityId: string) => {
    const isBookmarked = bookmarks.includes(opportunityId);
    trackEvent(isBookmarked ? 'bookmark_removed' : 'bookmark_added', {
      opportunity_id: opportunityId
    });
    toggleBookmark(opportunityId);
  };

  // Track page engagement
  useEffect(() => {
    if (!loading) {
      trackEvent('opportunities_page_loaded', {
        total_opportunities: opportunities.length,
        active_filters: Object.entries(filters).filter(([key, value]) => value && value !== 'All').length
      });
    }
  }, [opportunities.length, loading]);

  const typeOptions = ['All', 'Internship', 'Contest', 'Event', 'Scholarship'];
  const domainOptions = ['All', 'Technology', 'Finance', 'Healthcare', 'Marketing', 'Design', 'Engineering', 'Business', 'Education', 'Other'];

  const getTypeColor = (type: string) => {
    const colors = {
      'Internship': 'bg-blue-100 text-blue-800',
      'Contest': 'bg-green-100 text-green-800',
      'Event': 'bg-purple-100 text-purple-800',
      'Scholarship': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading opportunities: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Opportunities</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.domain} onValueChange={(value) => handleFilterChange('domain', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((domain) => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-gray-600">
            Showing {opportunities.length} opportunities
          </p>
        </div>

        <div className="grid gap-6">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getTypeColor(opportunity.type)}>
                        {opportunity.type}
                      </Badge>
                      <Badge variant="outline">{opportunity.domain}</Badge>
                    </div>
                    <Link 
                      to={`/opportunities/${opportunity.id}`}
                      onClick={() => handleOpportunityClick(opportunity.id, opportunity.title)}
                    >
                      <CardTitle className="text-xl hover:text-red-600 transition-colors">
                        {opportunity.title}
                      </CardTitle>
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmarkClick(opportunity.id)}
                    className={bookmarks.includes(opportunity.id) ? 'text-red-500' : 'text-gray-400'}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarks.includes(opportunity.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {opportunity.description.length > 200 
                    ? `${opportunity.description.substring(0, 200)}...` 
                    : opportunity.description
                  }
                </CardDescription>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {opportunity.company && (
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>{opportunity.company}</span>
                    </div>
                  )}
                  {opportunity.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{opportunity.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {opportunity.tags && opportunity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <Link to={`/opportunities/${opportunity.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Button asChild size="sm">
                    <a 
                      href={opportunity.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => handleExternalLinkClick(opportunity.id, opportunity.source_url)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Apply Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {opportunities.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No opportunities found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
