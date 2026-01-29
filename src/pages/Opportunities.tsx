
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Briefcase
} from 'lucide-react';

const Opportunities = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  
  const { opportunities, loading } = useOpportunities({
    type: activeTab === 'all' ? undefined : activeTab,
    search: searchTerm,
    domain: selectedDomain || undefined
  });

  const { bookmarks, toggleBookmark } = useBookmarks();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internship": return "bg-blue-100 text-blue-800";
      case "Job": return "bg-green-100 text-green-800";
      case "Contest": return "bg-purple-100 text-purple-800";
      case "Fellowship": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const domains = ['Tech', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design'];

  const filteredOpportunities = opportunities.filter(opp => 
    opp.type !== 'Scholarship' // Exclude scholarships from opportunities
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Career Opportunities</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover internships, jobs, contests, and fellowships from top companies worldwide
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
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
                <option value="">All Domains</option>
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
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Internship">Internships</TabsTrigger>
            <TabsTrigger value="Job">Jobs</TabsTrigger>
            <TabsTrigger value="Contest">Contests</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading opportunities...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {filteredOpportunities.length} opportunities found
              </h2>
            </div>

            {/* Opportunities Grid */}
            {filteredOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Briefcase className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No opportunities found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria or check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getTypeColor(opportunity.type)}>
                            {opportunity.type}
                          </Badge>
                          {opportunity.featured && (
                            <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                          )}
                          {opportunity.remote_work_allowed && (
                            <Badge variant="secondary">Remote</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(opportunity.id)}
                          className="flex-shrink-0"
                        >
                          {bookmarks.includes(opportunity.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2">
                        {opportunity.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{opportunity.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {opportunity.company && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{opportunity.company}</span>
                          </div>
                        )}
                        {opportunity.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{opportunity.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-muted-foreground truncate">
                          {opportunity.domain}
                        </span>
                        <div className="flex gap-2">
                          <Link to={`/opportunities/${opportunity.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                          <Button size="sm" asChild>
                            <a 
                              href={opportunity.source_url} 
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

export default Opportunities;
