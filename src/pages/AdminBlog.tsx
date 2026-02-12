import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNavigation from '@/components/AdminNavigation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Plus, Edit, Trash2, Eye, Search, Save, X, Loader2, BookOpen
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
}

const CATEGORIES = [
  'Interview Preparation', 'Salary Negotiation', 'Resume Writing',
  'Career Development', 'EdTech Trends', 'Remote Work', 'Skills Development',
  'Networking', 'Freelancing', 'Personal Branding'
];

const AdminBlog = () => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: 'Career Development',
    tags: '', author: 'OpportunityHub Team', is_published: true,
  });

  useEffect(() => { fetchArticles(); }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleChange = (field: string, value: any) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !editingArticle) next.slug = generateSlug(value);
      return next;
    });
  };

  const openNew = () => {
    setEditingArticle(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', category: 'Career Development', tags: '', author: 'OpportunityHub Team', is_published: true });
    setShowEditor(true);
  };

  const openEdit = (article: BlogArticle) => {
    setEditingArticle(article);
    setForm({
      title: article.title, slug: article.slug, excerpt: article.excerpt,
      content: article.content, category: article.category,
      tags: (article.tags || []).join(', '), author: article.author,
      is_published: article.is_published ?? true,
    });
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content || !form.excerpt) {
      toast({ title: 'Missing fields', description: 'Title, excerpt, and content are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        author: form.author,
        is_published: form.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editingArticle) {
        const { error } = await supabase.from('blog_articles').update(payload).eq('id', editingArticle.id);
        if (error) throw error;
        toast({ title: 'Updated', description: 'Article updated successfully.' });
      } else {
        const { error } = await supabase.from('blog_articles').insert(payload);
        if (error) throw error;
        toast({ title: 'Created', description: 'Article published successfully.' });
      }
      setShowEditor(false);
      fetchArticles();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const { error } = await supabase.from('blog_articles').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Article deleted.' });
      fetchArticles();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen size="lg" message="Loading articles..." />;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Blog Management</h1>
              <p className="text-muted-foreground mt-1">Create, edit, and manage blog articles</p>
            </div>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> New Article</Button>
          </div>
        </div>
      </div>
      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        <div className="space-y-4">
          {filtered.map(article => (
            <Card key={article.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <Badge variant={article.is_published ? 'default' : 'outline'}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {article.view_count || 0}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{article.excerpt}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      By {article.author} • {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => window.open(`/blog/${article.slug}`, '_blank')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(article)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No articles found.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'Edit Article' : 'Create New Article'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => handleChange('title', e.target.value)} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={e => handleChange('slug', e.target.value)} /></div>
            <div><Label>Excerpt (short summary)</Label><Textarea value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)} rows={2} /></div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => handleChange('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => handleChange('tags', e.target.value)} placeholder="career, tips, interview" /></div>
            <div><Label>Author</Label><Input value={form.author} onChange={e => handleChange('author', e.target.value)} /></div>
            <div><Label>Content (Markdown supported)</Label><Textarea value={form.content} onChange={e => handleChange('content', e.target.value)} rows={15} className="font-mono text-sm" /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={v => handleChange('is_published', v)} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditor(false)}><X className="h-4 w-4 mr-2" /> Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {editingArticle ? 'Update' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
