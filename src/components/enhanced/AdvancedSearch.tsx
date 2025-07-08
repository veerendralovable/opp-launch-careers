
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Building, 
  Star,
  Clock,
  BookmarkIcon,
  Send,
  X,
  Save,
  History
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFilters {
  [key: string]: string[] | boolean | string;
  type: string[];
  domain: string[];
  location: string[];
  company: string[];
  remote: boolean;
  deadline: 'all' | 'week' | 'month' | 'three_months';
  featured: boolean;
}

interface SavedSearch {
  id: string;
  name: string;
  search_criteria: {
    query?: string;
    filters?: SearchFilters;
  };
  notification_enabled: boolean;
}

const AdvancedSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    domain: [],
    location: [],
    company: [],
    remote: false,
    deadline: 'all',
    featured: false
  });
  
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const debouncedFilters = useDebounce(filters, 300);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSavedSearches();
    }
  }, [user]);

  useEffect(() => {
    if (debouncedQuery || Object.values(debouncedFilters).some(v => 
      Array.isArray(v) ? v.length > 0 : v === true || v !== 'all'
    )) {
      performSearch();
    }
  }, [debouncedQuery, debouncedFilters]);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const loadSavedSearches = async () => {
    try {
      const { data } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        const typedSavedSearches: SavedSearch[] = data.map(item => ({
          id: item.id,
          name: item.name,
          search_criteria: typeof item.search_criteria === 'object' && item.search_criteria !== null 
            ? item.search_criteria as { query?: string; filters?: SearchFilters }
            : { query: '', filters: filters },
          notification_enabled: item.notification_enabled || false
        }));
        setSavedSearches(typedSavedSearches);
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await supabase
        .from('opportunities')
        .select('title, company, tags')
        .ilike('title', `%${query}%`)
        .eq('is_approved', true)
        .limit(5);

      const titleSuggestions = data?.map(opp => opp.title) || [];
      const companySuggestions = data?.map(opp => opp.company).filter(Boolean) || [];
      const tagSuggestions = data?.flatMap(opp => opp.tags || []) || [];
      
      const allSuggestions = [...new Set([...titleSuggestions, ...companySuggestions, ...tagSuggestions])]
        .filter(suggestion => suggestion && suggestion.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);
      
      setSuggestions(allSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      let query_builder = supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      // Text search
      if (debouncedQuery) {
        query_builder = query_builder.or(
          `title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%,company.ilike.%${debouncedQuery}%`
        );
      }

      // Type filter
      if (filters.type.length > 0) {
        query_builder = query_builder.in('type', filters.type);
      }

      // Domain filter
      if (filters.domain.length > 0) {
        query_builder = query_builder.in('domain', filters.domain);
      }

      // Location filter
      if (filters.location.length > 0) {
        query_builder = query_builder.in('location', filters.location);
      }

      // Company filter
      if (filters.company.length > 0) {
        query_builder = query_builder.in('company', filters.company);
      }

      // Remote work filter
      if (filters.remote) {
        query_builder = query_builder.eq('remote_work_allowed', true);
      }

      // Featured filter
      if (filters.featured) {
        query_builder = query_builder.eq('featured', true);
      }

      // Deadline filter
      if (filters.deadline !== 'all') {
        const now = new Date();
        let deadlineDate = new Date();
        
        switch (filters.deadline) {
          case 'week':
            deadlineDate.setDate(now.getDate() + 7);
            break;
          case 'month':
            deadlineDate.setMonth(now.getMonth() + 1);
            break;
          case 'three_months':
            deadlineDate.setMonth(now.getMonth() + 3);
            break;
        }
        
        query_builder = query_builder.lte('deadline', deadlineDate.toISOString().split('T')[0]);
      }

      const { data, error } = await query_builder.limit(50);
      
      if (error) throw error;
      setOpportunities(data || []);
      
      // Track search analytics
      if (user && (debouncedQuery || Object.values(debouncedFilters).some(v => 
        Array.isArray(v) ? v.length > 0 : v === true || v !== 'all'
      ))) {
        try {
          await supabase.from('analytics').insert({
            user_id: user.id,
            event_type: 'search',
            metadata: {
              query: debouncedQuery,
              filters: JSON.stringify(debouncedFilters),
              results_count: data?.length || 0
            }
          });
        } catch (analyticsError) {
          console.error('Error tracking search analytics:', analyticsError);
        }
      }
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async () => {
    if (!user || !saveSearchName.trim()) return;
    
    try {
      const searchCriteria = {
        query,
        filters: JSON.parse(JSON.stringify(filters)) // Ensure it's properly serializable
      };

      await supabase.from('saved_searches').insert({
        user_id: user.id,
        name: saveSearchName.trim(),
        search_criteria: searchCriteria,
        notification_enabled: true
      });
      
      setSaveSearchName('');
      setShowSaveDialog(false);
      loadSavedSearches();
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    const criteria = savedSearch.search_criteria;
    setQuery(criteria.query || '');
    setFilters(criteria.filters || {
      type: [],
      domain: [],
      location: [],
      company: [],
      remote: false,
      deadline: 'all',
      featured: false
    });
  };

  const toggleFilter = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const currentArray = prev[filterType] as string[];
        return {
          ...prev,
          [filterType]: currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      domain: [],
      location: [],
      company: [],
      remote: false,
      deadline: 'all',
      featured: false
    });
    setQuery('');
  };

  const bookmarkOpportunity = async (opportunityId: string) => {
    if (!user) return;
    
    try {
      await supabase.from('bookmarks').insert({
        user_id: user.id,
        opportunity_id: opportunityId
      });
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

  const applyForOpportunity = async (opportunityId: string) => {
    if (!user) return;
    
    try {
      await supabase.from('applications').insert({
        user_id: user.id,
        opportunity_id: opportunityId,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  const filterOptions = {
    type: ['Internship', 'Job', 'Scholarship', 'Contest', 'Fellowship'],
    domain: ['Tech', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Engineering'],
    location: ['Remote', 'New York', 'San Francisco', 'London', 'Berlin', 'Toronto', 'Mumbai'],
    company: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Tesla']
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Advanced Search</h1>
          <p className="text-gray-600">Find opportunities with powerful search and filtering</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Saved Searches */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Saved Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedSearches.map((savedSearch) => (
                    <div
                      key={savedSearch.id}
                      className="p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => loadSavedSearch(savedSearch)}
                    >
                      <p className="font-medium text-sm">{savedSearch.name}</p>
                      {savedSearch.notification_enabled && (
                        <Badge variant="secondary" className="mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Alerts On
                        </Badge>
                      )}
                    </div>
                  ))}
                  {savedSearches.length === 0 && (
                    <p className="text-gray-500 text-center py-4 text-sm">No saved searches</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type Filter */}
                <div>
                  <h3 className="font-medium mb-2">Type</h3>
                  <div className="space-y-2">
                    {filterOptions.type.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.type.includes(type)}
                          onCheckedChange={() => toggleFilter('type', type)}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Domain Filter */}
                <div>
                  <h3 className="font-medium mb-2">Domain</h3>
                  <div className="space-y-2">
                    {filterOptions.domain.map((domain) => (
                      <label key={domain} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.domain.includes(domain)}
                          onCheckedChange={() => toggleFilter('domain', domain)}
                        />
                        <span className="text-sm">{domain}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Location Filter */}
                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  <div className="space-y-2">
                    {filterOptions.location.map((location) => (
                      <label key={location} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={filters.location.includes(location)}
                          onCheckedChange={() => toggleFilter('location', location)}
                        />
                        <span className="text-sm">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Additional Filters */}
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={filters.remote}
                      onCheckedChange={(checked) => toggleFilter('remote', checked)}
                    />
                    <span className="text-sm">Remote Work Allowed</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={filters.featured}
                      onCheckedChange={(checked) => toggleFilter('featured', checked)}
                    />
                    <span className="text-sm">Featured Only</span>
                  </label>
                </div>

                <Separator />

                {/* Deadline Filter */}
                <div>
                  <h3 className="font-medium mb-2">Deadline</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Any time' },
                      { value: 'week', label: 'Within a week' },
                      { value: 'month', label: 'Within a month' },
                      { value: 'three_months', label: 'Within 3 months' }
                    ].map(({ value, label }) => (
                      <label key={value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="deadline"
                          checked={filters.deadline === value}
                          onChange={() => toggleFilter('deadline', value)}
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search opportunities, companies, skills..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10"
                    />
                    
                    {/* Search Suggestions */}
                    {suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            onClick={() => {
                              setQuery(suggestion);
                              setSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button onClick={() => setShowSaveDialog(true)} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Search
                  </Button>
                </div>

                {/* Active Filters */}
                {(query || Object.values(filters).some(v => 
                  Array.isArray(v) ? v.length > 0 : v === true || v !== 'all'
                )) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {query && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        "{query}"
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setQuery('')} />
                      </Badge>
                    )}
                    
                    {filters.type.map((type) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        {type}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('type', type)} />
                      </Badge>
                    ))}
                    
                    {filters.domain.map((domain) => (
                      <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                        {domain}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('domain', domain)} />
                      </Badge>
                    ))}
                    
                    {filters.location.map((location) => (
                      <Badge key={location} variant="secondary" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('location', location)} />
                      </Badge>
                    ))}
                    
                    {filters.remote && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Remote
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('remote', false)} />
                      </Badge>
                    )}
                    
                    {filters.featured && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Featured
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter('featured', false)} />
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {loading ? 'Searching...' : `${opportunities.length} opportunities found`}
                </h2>
              </div>

              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{opportunity.title}</h3>
                            {opportunity.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
                              Due {new Date(opportunity.deadline).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3 line-clamp-2">{opportunity.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{opportunity.type}</Badge>
                            <Badge variant="outline">{opportunity.domain}</Badge>
                            {opportunity.remote_work_allowed && (
                              <Badge variant="secondary">Remote</Badge>
                            )}
                            {opportunity.tags?.slice(0, 3).map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => bookmarkOpportunity(opportunity.id)}
                            variant="outline"
                          >
                            <BookmarkIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => applyForOpportunity(opportunity.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {!loading && opportunities.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Search Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Save Search</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Enter search name"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  className="mb-4"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveSearch}>
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
