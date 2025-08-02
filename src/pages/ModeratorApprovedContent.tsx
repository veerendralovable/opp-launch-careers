
import React, { useState, useEffect } from 'react';
import ModeratorNavigation from '@/components/ModeratorNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  Search, 
  Eye,
  Trash2,
  Calendar,
  User,
  Loader2
} from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

const ModeratorApprovedContent = () => {
  const [approvedContent, setApprovedContent] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovedContent();
  }, []);

  const fetchApprovedContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('is_approved', true)
        .order('approved_at', { ascending: false });

      if (error) throw error;
      setApprovedContent(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch approved content",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = approvedContent.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const revokeApproval = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ is_approved: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Approval revoked successfully"
      });
      
      fetchApprovedContent();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to revoke approval",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading approved content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Approved Content</h1>
              <p className="text-gray-600 mt-2">View and manage approved opportunities</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">{approvedContent.length} approved items</span>
            </div>
          </div>
        </div>
      </div>

      <ModeratorNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search approved content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredContent.map((item) => (
            <Card key={item.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Approved: {item.approved_at ? new Date(item.approved_at).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Type: {item.type}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                      {item.is_featured && (
                        <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/opportunities/${item.id}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeApproval(item.id)}
                    >
                      Revoke Approval
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredContent.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No approved content</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'No content matches your search.' : 'No content has been approved yet.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorApprovedContent;
