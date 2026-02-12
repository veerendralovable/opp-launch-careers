import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminNavigation from '@/components/AdminNavigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Search, Edit, Trash2, Eye, CheckCircle, XCircle, Save, X, Loader2, Building, MapPin, Calendar
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

const AdminAllOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '', description: '', type: 'Internship', domain: 'General', company: '',
    location: '', deadline: '', source_url: '', experience_required: '',
    employment_type: '', skill_difficulty: 'Intermediate', hiring_timeline: '2-4 weeks',
    meta_description: '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const openEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setForm({
      title: opp.title || '', description: opp.description || '', type: opp.type || 'Internship',
      domain: opp.domain || 'General', company: opp.company || '', location: opp.location || '',
      deadline: opp.deadline || '', source_url: opp.source_url || '',
      experience_required: opp.experience_required || '', employment_type: opp.employment_type || '',
      skill_difficulty: opp.skill_difficulty || 'Intermediate',
      hiring_timeline: opp.hiring_timeline || '2-4 weeks',
      meta_description: opp.meta_description || '',
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!editingOpp) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('opportunities').update({
        title: form.title, description: form.description, type: form.type, domain: form.domain,
        company: form.company, location: form.location, deadline: form.deadline || null,
        source_url: form.source_url, experience_required: form.experience_required,
        employment_type: form.employment_type, skill_difficulty: form.skill_difficulty,
        hiring_timeline: form.hiring_timeline, meta_description: form.meta_description,
        updated_at: new Date().toISOString(),
      }).eq('id', editingOpp.id);
      if (error) throw error;
      toast({ title: 'Updated', description: 'Opportunity updated successfully.' });
      setShowEditor(false);
      fetchAll();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.from('opportunities').update({
        is_approved: true, approved_by: user?.id, approved_at: new Date().toISOString()
      }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Approved' });
      fetchAll();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const { error } = await supabase.from('opportunities').update({ is_approved: false }).eq('id', id);
      if (error) throw error;
      toast({ title: 'Revoked' });
      fetchAll();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this opportunity?')) return;
    try {
      const { error } = await supabase.from('opportunities').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted' });
      fetchAll();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filtered = opportunities.filter(o => {
    const matchesSearch = !searchTerm ||
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true :
      activeTab === 'approved' ? o.is_approved === true :
      activeTab === 'pending' ? o.is_approved === false : true;
    return matchesSearch && matchesTab;
  });

  const counts = {
    all: opportunities.length,
    approved: opportunities.filter(o => o.is_approved).length,
    pending: opportunities.filter(o => !o.is_approved).length,
  };

  if (loading) return <LoadingSpinner fullScreen size="lg" message="Loading opportunities..." />;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">All Opportunities</h1>
          <p className="text-muted-foreground mt-1">View, edit, approve, and manage all opportunities</p>
        </div>
      </div>
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filtered.map(opp => (
            <Card key={opp.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary">{opp.type}</Badge>
                      <Badge variant="outline">{opp.domain}</Badge>
                      <Badge variant={opp.is_approved ? 'default' : 'destructive'}>
                        {opp.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                      {opp.featured && <Badge className="bg-primary/10 text-primary">Featured</Badge>}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {opp.view_count || 0}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">{opp.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      {opp.company && <span className="flex items-center gap-1"><Building className="h-3 w-3" />{opp.company}</span>}
                      {opp.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{opp.location}</span>}
                      {opp.deadline && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{opp.deadline}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{opp.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => openEdit(opp)}><Edit className="h-4 w-4" /></Button>
                    {!opp.is_approved && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(opp.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {opp.is_approved && (
                      <Button variant="outline" size="sm" onClick={() => handleRevoke(opp.id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(opp.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card><CardContent className="pt-6 text-center"><p className="text-muted-foreground">No opportunities found.</p></CardContent></Card>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Opportunity</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => handleChange('title', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={form.type} onValueChange={v => handleChange('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Internship', 'Job', 'Contest', 'Scholarship', 'Fellowship', 'Event', 'Workshop'].map(t =>
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Domain</Label>
                <Select value={form.domain} onValueChange={v => handleChange('domain', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['General', 'Technology', 'Business', 'Design', 'Marketing', 'Finance', 'Education', 'Healthcare', 'Engineering'].map(d =>
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Company</Label><Input value={form.company} onChange={e => handleChange('company', e.target.value)} /></div>
              <div><Label>Location</Label><Input value={form.location} onChange={e => handleChange('location', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} /></div>
              <div><Label>Source URL</Label><Input value={form.source_url} onChange={e => handleChange('source_url', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Skill Difficulty</Label>
                <Select value={form.skill_difficulty} onValueChange={v => handleChange('skill_difficulty', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hiring Timeline</Label>
                <Select value={form.hiring_timeline} onValueChange={v => handleChange('hiring_timeline', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Immediate', '1-2 weeks', '2-4 weeks', '1-2 months', '2-3 months'].map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Experience Required</Label><Input value={form.experience_required} onChange={e => handleChange('experience_required', e.target.value)} /></div>
            </div>
            <div><Label>Meta Description (unique, 150 chars)</Label><Input value={form.meta_description} onChange={e => handleChange('meta_description', e.target.value)} maxLength={160} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={8} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditor(false)}><X className="h-4 w-4 mr-2" /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAllOpportunities;
