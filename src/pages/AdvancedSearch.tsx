
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Building, 
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  X,
  Loader2,
  Eye
} from 'lucide-react';

const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [domainFilters, setDomainFilters] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  
  const { opportunities, loading } = useOpportunities({
    type: typeFilters.length === 1 ? typeFilters[0] : undefined,
    domain: domainFilters.length === 1 ? domainFilters[0] : undefined,
    search: searchTerm,
    location: locationFilter,
    remoteOnly,
    featured: featuredOnly
  });

  const { bookmarks, toggleBookmark } = useBookmarks();

  const toggleFilter = (filterArray: string[], setFilterArray: (filters: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(item => item !== value));
    } else {
      setFilterArray([...filterArray, value]);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilters([]);
    setDomainFilters([]);
    setLocationFilter('');
    setRemoteOnly(false);
    setFeaturedOnly(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Internship": return "bg-blue-100 text-blue-800";
      case "Job": return "bg-green-100 text-green-800";
      case "Contest": return "bg-purple-100 text-purple-800";
      case "Scholarship": return "bg-amber-100 text-amber-800";
      case "Fellowship": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const typeOptions = ['Internship', 'Job', 'Contest', 'Scholarship', 'Fellowship'];
  const domainOptions = ['Tech', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Engineering'];
  const locationOptions = ['India', 'USA', 'UK', 'Canada', 'Remote', 'Global'];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Advanced Search</h1>
          <p className="text-muted-foreground mb-6">Find opportunities with powerful search and filtering</p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search opportunities, companies, skills..."
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
                  onClick={clearAllFilters}
                  className="h-12 px-4"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {showFilters && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Type Filter */}
                    <div>
                      <h3 className="font-medium mb-3">Type</h3>
                      <div className="space-y-2">
                        {typeOptions.map((type) => (
                          <label key={type} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={typeFilters.includes(type)}
                              onCheckedChange={() => toggleFilter(typeFilters, setTypeFilters, type)}
                            />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Domain Filter */}
                    <div>
                      <h3 className="font-medium mb-3">Domain</h3>
                      <div className="space-y-2">
                        {domainOptions.map((domain) => (
                          <label key={domain} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={domainFilters.includes(domain)}
                              onCheckedChange={() => toggleFilter(domainFilters, setDomainFilters, domain)}
                            />
                            <span className="text-sm">{domain}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Additional Filters */}
                    <div>
                      <h3 className="font-medium mb-3">Additional Filters</h3>
                      <div className="space-y-3">
                        <select
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground"
                        >
                          <option value="">All Locations</option>
                          {locationOptions.map((location) => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                        
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={remoteOnly}
                            onCheckedChange={(checked) => setRemoteOnly(!!checked)}
                          />
                          <span className="text-sm">Remote Work Only</span>
                        </label>
                        
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <Checkbox
                            checked={featuredOnly}
                            onCheckedChange={(checked) => setFeaturedOnly(!!checked)}
                          />
                          <span className="text-sm">Featured Only</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(searchTerm || typeFilters.length > 0 || domainFilters.length > 0 || locationFilter || remoteOnly || featuredOnly) && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                      {searchTerm && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          "{searchTerm}"
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                        </Badge>
                      )}
                      
                      {typeFilters.map((type) => (
                        <Badge key={type} variant="secondary" className="flex items-center gap-1">
                          {type}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(typeFilters, setTypeFilters, type)} />
                        </Badge>
                      ))}
                      
                      {domainFilters.map((domain) => (
                        <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                          {domain}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter(domainFilters, setDomainFilters, domain)} />
                        </Badge>
                      ))}
                      
                      {locationFilter && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {locationFilter}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setLocationFilter('')} />
                        </Badge>
                      )}
                      
                      {remoteOnly && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Remote
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setRemoteOnly(false)} />
                        </Badge>
                      )}
                      
                      {featuredOnly && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Featured
                          <X className="h-3 w-3 cursor-pointer" onClick={() => setFeaturedOnly(false)} />
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Searching...</span>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {opportunities.length} opportunities found
              </h2>
            </div>

            {opportunities.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No opportunities found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-all duration-300">
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
                            {opportunity.title}
                          </CardTitle>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-shrink-0"
                          onClick={() => toggleBookmark(opportunity.id)}
                        >
                          {bookmarks.includes(opportunity.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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
                        <span className="text-sm text-gray-500 truncate">
                          {opportunity.domain}
                        </span>
                        <div className="flex gap-2">
                          <Link to={`/opportunities/${opportunity.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </Link>
                          <a 
                            href={opportunity.source_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block"
                          >
                            <Button size="sm">
                              Apply
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </Button>
                          </a>
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

export default AdvancedSearch;
