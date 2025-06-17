import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Plus, Upload, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Submit = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    domain: '',
    location: '',
    company: '',
    sourceUrl: '',
    deadline: undefined as Date | undefined,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const opportunityTypes = ['Internship', 'Contest', 'Event', 'Scholarship'];
  const domains = ['Tech', 'Design', 'Marketing', 'Finance', 'Engineering', 'Research', 'Other'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.domain) newErrors.domain = 'Domain is required';
    if (!formData.sourceUrl.trim()) newErrors.sourceUrl = 'Source URL is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';

    // URL validation
    if (formData.sourceUrl && !isValidUrl(formData.sourceUrl)) {
      newErrors.sourceUrl = 'Please enter a valid URL';
    }

    // Deadline validation
    if (formData.deadline && formData.deadline <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 10) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit opportunities.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Determine approval status based on user role
      const isApproved = userRole === 'admin' || userRole === 'moderator';

      const { error } = await supabase
        .from('opportunities')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          type: formData.type as 'Internship' | 'Contest' | 'Event' | 'Scholarship',
          domain: formData.domain,
          location: formData.location.trim() || null,
          company: formData.company.trim() || null,
          source_url: formData.sourceUrl.trim(),
          deadline: formData.deadline!.toISOString().split('T')[0],
          tags: tags,
          submitted_by: user.id,
          is_approved: isApproved,
          approved_at: isApproved ? new Date().toISOString() : null,
          approved_by: isApproved ? user.id : null,
        });

      if (error) throw error;

      const message = isApproved 
        ? "Your opportunity has been submitted and approved automatically."
        : "Your opportunity has been submitted and is pending approval.";

      toast({
        title: "Opportunity Submitted!",
        description: message,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        domain: '',
        location: '',
        company: '',
        sourceUrl: '',
        deadline: undefined,
      });
      setTags([]);
      setCurrentTag('');

      // Navigate to opportunities page
      navigate('/opportunities');

    } catch (error: any) {
      console.error('Error submitting opportunity:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit opportunity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to submit opportunities.</p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit an Opportunity</h1>
          <p className="text-gray-600 mt-2">
            Share internships, contests, events, and scholarships with the community
          </p>
          {(userRole === 'admin' || userRole === 'moderator') && (
            <div className="mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Your submissions will be automatically approved
              </Badge>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Opportunity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Software Engineering Internship at Google"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Type and Domain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {opportunityTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
                </div>

                <div>
                  <Label htmlFor="domain">Domain *</Label>
                  <Select value={formData.domain} onValueChange={(value) => handleInputChange('domain', value)}>
                    <SelectTrigger className={errors.domain ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.domain && <p className="text-sm text-red-500 mt-1">{errors.domain}</p>}
                </div>
              </div>

              {/* Company and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g., Google, Microsoft"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Remote, Bangalore, New York"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of the opportunity, requirements, and benefits..."
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tags (e.g., React, Python, Remote)"
                    onKeyPress={handleKeyPress}
                    maxLength={30}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    disabled={!currentTag.trim() || tags.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Add up to 10 tags. Press Enter or click + to add.
                </p>
              </div>

              {/* Deadline and Source URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Deadline *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.deadline && "text-muted-foreground",
                          errors.deadline && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deadline ? format(formData.deadline, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.deadline}
                        onSelect={(date) => handleInputChange('deadline', date)}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.deadline && <p className="text-sm text-red-500 mt-1">{errors.deadline}</p>}
                </div>

                <div>
                  <Label htmlFor="sourceUrl">Source URL *</Label>
                  <Input
                    id="sourceUrl"
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
                    placeholder="https://example.com/apply"
                    className={errors.sourceUrl ? 'border-red-500' : ''}
                  />
                  {errors.sourceUrl && <p className="text-sm text-red-500 mt-1">{errors.sourceUrl}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/opportunities')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Opportunity
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Submission Guidelines</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {userRole === 'admin' || userRole === 'moderator' ? (
                    <>
                      <li>• Your submissions are automatically approved due to your role</li>
                      <li>• Please ensure all information is accurate and up-to-date</li>
                      <li>• Include relevant tags to help users discover opportunities</li>
                      <li>• Provide a detailed description with clear requirements</li>
                    </>
                  ) : (
                    <>
                      <li>• All submissions are reviewed by our admin team before approval</li>
                      <li>• Please ensure all information is accurate and up-to-date</li>
                      <li>• Include relevant tags to help users discover your opportunity</li>
                      <li>• Provide a detailed description with clear requirements</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
