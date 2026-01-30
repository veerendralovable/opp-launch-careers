import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import AdminNavigation from '@/components/AdminNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Trash2,
  Eye,
  Save
} from 'lucide-react';

interface ParsedOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'job' | 'internship' | 'scholarship' | 'fellowship' | 'event';
  description: string;
  requirements: string[];
  deadline: string | null;
  salary_min: number | null;
  salary_max: number | null;
  source_url: string | null;
  tags: string[];
  selected: boolean;
}

const AdminBulkImport = () => {
  const [rawInput, setRawInput] = useState('');
  const [parsedOpportunities, setParsedOpportunities] = useState<ParsedOpportunity[]>([]);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Smart parsing function that handles various formats
  const parseOpportunities = () => {
    if (!rawInput.trim()) {
      toast({
        title: "No input",
        description: "Please paste some job posts to parse.",
        variant: "destructive",
      });
      return;
    }

    setParsing(true);
    setImportResults(null);

    try {
      // Split by common separators (double newlines, dashes, numbered items)
      const separatorPatterns = [
        /\n\s*---+\s*\n/g,  // Dashes
        /\n\s*===+\s*\n/g,  // Equals
        /\n\s*\*{3,}\s*\n/g, // Asterisks
        /\n(?=\d+\.\s+[A-Z])/g, // Numbered list (1. Title)
        /\n(?=•\s+)/g, // Bullet points
        /\n{3,}/g, // Triple+ newlines
      ];

      let chunks: string[] = [rawInput];
      
      // Try to split by separators
      for (const pattern of separatorPatterns) {
        if (rawInput.match(pattern)) {
          chunks = rawInput.split(pattern).filter(c => c.trim().length > 50);
          break;
        }
      }

      // If no clear separators, try to detect individual posts by patterns
      if (chunks.length === 1 && rawInput.length > 500) {
        // Look for repeated patterns like "Company:", "Position:", etc.
        const titlePattern = /(?:^|\n)(?:(?:Position|Title|Role|Job|Opportunity)[\s:]+)?([A-Z][^:\n]{10,60})(?:\n|$)/gm;
        const matches = rawInput.match(titlePattern);
        
        if (matches && matches.length > 1) {
          // Try splitting by these title patterns
          chunks = rawInput.split(/\n(?=(?:Position|Title|Role|Job|Opportunity)[\s:]+[A-Z])/gi)
            .filter(c => c.trim().length > 50);
        }
      }

      // Parse each chunk
      const opportunities: ParsedOpportunity[] = chunks.map((chunk, index) => {
        const lines = chunk.trim().split('\n').map(l => l.trim()).filter(l => l);
        
        // Extract title (usually first non-empty line or line with "Title:" prefix)
        let title = '';
        const titleLine = lines.find(l => 
          l.match(/^(?:title|position|role|job)[\s:]+/i) ||
          (l.length > 10 && l.length < 100 && !l.includes(':'))
        );
        
        if (titleLine) {
          title = titleLine.replace(/^(?:title|position|role|job)[\s:]+/i, '').trim();
        } else {
          title = lines[0] || `Opportunity ${index + 1}`;
        }
        
        // Clean up title
        title = title.replace(/^\d+\.\s*/, '').replace(/^[•\-]\s*/, '').trim();

        // Extract company
        let company = '';
        const companyLine = lines.find(l => l.match(/^(?:company|organization|employer|at)[\s:]+/i));
        if (companyLine) {
          company = companyLine.replace(/^(?:company|organization|employer|at)[\s:]+/i, '').trim();
        } else {
          // Try to find company in format "at Company Name" or "Company Name |"
          const atMatch = chunk.match(/(?:at|@)\s+([A-Z][A-Za-z0-9\s&.,]+?)(?:\n|,|\|)/);
          const pipeMatch = chunk.match(/^([A-Z][A-Za-z0-9\s&.,]+?)\s*\|/m);
          company = atMatch?.[1]?.trim() || pipeMatch?.[1]?.trim() || 'Unknown Company';
        }

        // Extract location
        let location = '';
        const locationLine = lines.find(l => l.match(/^(?:location|place|city|where)[\s:]+/i));
        if (locationLine) {
          location = locationLine.replace(/^(?:location|place|city|where)[\s:]+/i, '').trim();
        } else {
          const locMatch = chunk.match(/(?:Remote|Hybrid|On-site|Onsite|Work from home|WFH|[A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+,\s*[A-Z][a-z]+)/i);
          location = locMatch?.[0] || 'Not specified';
        }

        // Determine type
        let type: ParsedOpportunity['type'] = 'job';
        const lowerChunk = chunk.toLowerCase();
        if (lowerChunk.includes('internship') || lowerChunk.includes('intern ')) {
          type = 'internship';
        } else if (lowerChunk.includes('scholarship') || lowerChunk.includes('grant') || lowerChunk.includes('stipend')) {
          type = 'scholarship';
        } else if (lowerChunk.includes('fellowship')) {
          type = 'fellowship';
        } else if (lowerChunk.includes('hackathon') || lowerChunk.includes('competition') || lowerChunk.includes('event')) {
          type = 'event';
        }

        // Extract description (everything that's not a field)
        const fieldPatterns = /^(?:title|company|location|salary|deadline|requirements|skills|apply|url|link|type|position|role)[\s:]+/i;
        const descLines = lines.filter(l => !l.match(fieldPatterns) && l.length > 20);
        const description = descLines.slice(0, 5).join('\n') || chunk.slice(0, 500);

        // Extract requirements
        const requirements: string[] = [];
        const reqSection = chunk.match(/(?:requirements?|qualifications?|skills?|must have|looking for)[\s:]*\n?((?:[•\-*]\s*.+\n?)+)/i);
        if (reqSection) {
          const reqLines = reqSection[1].split('\n')
            .map(l => l.replace(/^[•\-*]\s*/, '').trim())
            .filter(l => l.length > 3);
          requirements.push(...reqLines);
        }

        // Extract deadline
        let deadline: string | null = null;
        const deadlineMatch = chunk.match(/(?:deadline|apply by|last date|closes?|due)[\s:]+([A-Za-z]+\s+\d{1,2},?\s*\d{4}|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
        if (deadlineMatch) {
          try {
            const parsed = new Date(deadlineMatch[1]);
            if (!isNaN(parsed.getTime())) {
              deadline = parsed.toISOString().split('T')[0];
            }
          } catch {
            // Ignore parsing errors
          }
        }

        // Extract salary
        let salary_min: number | null = null;
        let salary_max: number | null = null;
        const salaryMatch = chunk.match(/(?:\$|USD|₹|INR)\s*(\d{1,3}(?:,\d{3})*|\d+)(?:K|k)?(?:\s*[-–to]+\s*(?:\$|USD|₹|INR)?\s*(\d{1,3}(?:,\d{3})*|\d+)(?:K|k)?)?/);
        if (salaryMatch) {
          let min = parseInt(salaryMatch[1].replace(/,/g, ''));
          let max = salaryMatch[2] ? parseInt(salaryMatch[2].replace(/,/g, '')) : min;
          
          // Handle K notation
          if (salaryMatch[0].toLowerCase().includes('k')) {
            min *= 1000;
            max *= 1000;
          }
          
          salary_min = min;
          salary_max = max;
        }

        // Extract URL
        let source_url: string | null = null;
        const urlMatch = chunk.match(/(?:https?:\/\/[^\s<>"{}|\\^`\[\]]+)/);
        if (urlMatch) {
          source_url = urlMatch[0];
        }

        // Generate tags
        const tags: string[] = [];
        const tagPatterns = {
          'Remote': /remote|work from home|wfh/i,
          'Full-time': /full[\s-]?time/i,
          'Part-time': /part[\s-]?time/i,
          'Entry Level': /entry[\s-]?level|fresher|junior|0-2 years/i,
          'Senior': /senior|lead|principal|staff/i,
          'Tech': /software|developer|engineer|programming|coding/i,
          'Design': /design|ux|ui|creative/i,
          'Marketing': /marketing|seo|content|social media/i,
          'Finance': /finance|accounting|banking|investment/i,
          'Paid': /paid|stipend|salary|compensation/i,
        };

        for (const [tag, pattern] of Object.entries(tagPatterns)) {
          if (pattern.test(chunk)) {
            tags.push(tag);
          }
        }

        return {
          id: `temp-${Date.now()}-${index}`,
          title: title.slice(0, 200),
          company: company.slice(0, 100),
          location: location.slice(0, 100),
          type,
          description: description.slice(0, 2000),
          requirements: requirements.slice(0, 10),
          deadline,
          salary_min,
          salary_max,
          source_url,
          tags: tags.slice(0, 5),
          selected: true,
        };
      });

      setParsedOpportunities(opportunities);
      
      toast({
        title: "Parsing complete",
        description: `Found ${opportunities.length} opportunities. Review and import.`,
      });
    } catch (error) {
      console.error('Parsing error:', error);
      toast({
        title: "Parsing failed",
        description: "Could not parse the input. Try a different format.",
        variant: "destructive",
      });
    } finally {
      setParsing(false);
    }
  };

  const toggleSelection = (id: string) => {
    setParsedOpportunities(prev => 
      prev.map(opp => opp.id === id ? { ...opp, selected: !opp.selected } : opp)
    );
  };

  const toggleAll = (selected: boolean) => {
    setParsedOpportunities(prev => prev.map(opp => ({ ...opp, selected })));
  };

  const removeOpportunity = (id: string) => {
    setParsedOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  const importOpportunities = async () => {
    const selected = parsedOpportunities.filter(opp => opp.selected);
    
    if (selected.length === 0) {
      toast({
        title: "No opportunities selected",
        description: "Please select at least one opportunity to import.",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    let success = 0;
    let failed = 0;

    try {
      for (const opp of selected) {
        const { error } = await supabase.from('opportunities').insert({
          title: opp.title,
          company: opp.company,
          location: opp.location,
          type: opp.type,
          description: opp.description,
          requirements: opp.requirements,
          deadline: opp.deadline,
          salary_min: opp.salary_min,
          salary_max: opp.salary_max,
          source_url: opp.source_url,
          tags: opp.tags,
          submitted_by: user?.id,
          is_approved: true, // Auto-approve since admin is importing
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Import error:', error);
          failed++;
        } else {
          success++;
        }
      }

      setImportResults({ success, failed });
      
      if (success > 0) {
        setParsedOpportunities(prev => prev.filter(opp => !opp.selected));
        toast({
          title: "Import complete",
          description: `Successfully imported ${success} opportunities.`,
        });
      }
      
      if (failed > 0) {
        toast({
          title: "Some imports failed",
          description: `${failed} opportunities could not be imported.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred during import.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'internship': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scholarship': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'fellowship': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'event': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bulk Import</h1>
              <p className="text-muted-foreground mt-1">Paste multiple job posts and import them at once</p>
            </div>
          </div>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Paste Job Posts
                </CardTitle>
                <CardDescription>
                  Paste multiple job posts separated by blank lines, dashes (---), or numbered lists.
                  The parser will automatically extract titles, companies, locations, and more.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`Example format:

1. Software Engineer at Google
Location: Mountain View, CA (Remote)
Salary: $150,000 - $200,000
Requirements:
• 3+ years of experience
• Proficiency in Python/Java
Apply by: March 30, 2026
https://careers.google.com/...

---

2. Product Design Intern at Apple
Location: Cupertino, CA
Type: Internship (Paid)
Duration: 3 months
Requirements:
• Currently enrolled in design program
• Portfolio required

---

(Continue with more posts...)`}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={parseOpportunities} 
                    disabled={parsing || !rawInput.trim()}
                    className="flex-1"
                  >
                    {parsing ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Parse Opportunities
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRawInput('');
                      setParsedOpportunities([]);
                      setImportResults(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Parsing Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Separate posts with blank lines, --- or numbered lists</li>
                  <li>• Include "Company:" or "at Company Name" for company detection</li>
                  <li>• Add "Location:" or include city names for location</li>
                  <li>• Use bullet points for requirements/skills</li>
                  <li>• Include URLs for application links</li>
                  <li>• Mention "internship", "scholarship" etc. for auto-type detection</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Parsed Results Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Parsed Results ({parsedOpportunities.length})
                  </CardTitle>
                  {parsedOpportunities.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleAll(true)}>
                        Select All
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleAll(false)}>
                        Deselect All
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {parsedOpportunities.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No opportunities parsed yet.</p>
                    <p className="text-sm">Paste job posts and click "Parse Opportunities"</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {parsedOpportunities.map((opp) => (
                      <div 
                        key={opp.id} 
                        className={`p-4 border rounded-lg transition-colors ${
                          opp.selected ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={opp.selected}
                            onCheckedChange={() => toggleSelection(opp.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-foreground truncate">{opp.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => removeOpportunity(opp.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{opp.company}</p>
                            <p className="text-sm text-muted-foreground">{opp.location}</p>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge className={getTypeColor(opp.type)}>{opp.type}</Badge>
                              {opp.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                            
                            {opp.salary_min && (
                              <p className="text-xs text-muted-foreground mt-1">
                                💰 ${opp.salary_min.toLocaleString()}{opp.salary_max && opp.salary_max !== opp.salary_min ? ` - $${opp.salary_max.toLocaleString()}` : ''}
                              </p>
                            )}
                            {opp.deadline && (
                              <p className="text-xs text-muted-foreground">
                                📅 Deadline: {new Date(opp.deadline).toLocaleDateString()}
                              </p>
                            )}
                            {opp.requirements.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                📋 {opp.requirements.length} requirements found
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Import Button */}
            {parsedOpportunities.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  {importResults && (
                    <Alert className="mb-4">
                      <AlertDescription className="flex items-center gap-2">
                        {importResults.success > 0 && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            {importResults.success} imported
                          </span>
                        )}
                        {importResults.failed > 0 && (
                          <span className="flex items-center gap-1 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            {importResults.failed} failed
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    onClick={importOpportunities} 
                    disabled={importing || parsedOpportunities.filter(o => o.selected).length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {importing ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Import {parsedOpportunities.filter(o => o.selected).length} Selected Opportunities
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Imported opportunities will be auto-approved and visible immediately.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBulkImport;
