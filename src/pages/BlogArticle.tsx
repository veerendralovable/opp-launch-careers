
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Eye, Share2, BookOpen } from 'lucide-react';
import SEO from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);

  useEffect(() => {
    if (slug) fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/blog');
        return;
      }
      
      setArticle(data);

      // Increment view count
      await supabase
        .from('blog_articles')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      // Fetch related articles
      const { data: related } = await supabase
        .from('blog_articles')
        .select('id, title, slug, excerpt, category, created_at')
        .eq('is_published', true)
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(3);

      setRelatedArticles(related || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareArticle = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: article?.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Article link copied to clipboard." });
    }
  };

  // Simple markdown-to-HTML renderer
  const renderContent = (content: string) => {
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-3 text-foreground">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 text-muted-foreground">• $1</li>')
      .replace(/^\d+\. \*\*(.*?)\*\*(.*$)/gm, '<li class="ml-4 text-muted-foreground"><strong>$1</strong>$2</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 text-muted-foreground">$1</li>')
      .replace(/❌ (.*$)/gm, '<div class="bg-destructive/10 p-2 rounded my-1 text-sm">❌ $1</div>')
      .replace(/✅ (.*$)/gm, '<div class="bg-green-500/10 p-2 rounded my-1 text-sm">✅ $1</div>')
      .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-4">')
      .replace(/\n/g, '<br/>');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!article) return null;

  return (
    <>
      <SEO 
        title={`${article.title} - OpportunityHub Blog`}
        description={article.excerpt}
      />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate('/blog')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Button>
            <Button variant="outline" size="sm" onClick={shareArticle}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>

          {/* Article */}
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge>{article.category}</Badge>
                {article.tags?.slice(0, 3).map((tag: string, i: number) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{article.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{article.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" /> {article.view_count} views
                </div>
              </div>
            </header>

            <Card>
              <CardContent className="p-6 md:p-10 prose max-w-none dark:prose-invert">
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
                />
              </CardContent>
            </Card>
          </article>

          {/* Related */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map(ra => (
                  <Card key={ra.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Badge variant="secondary" className="mb-2">{ra.category}</Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        <Link to={`/blog/${ra.slug}`} className="hover:text-primary transition-colors">
                          {ra.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ra.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogArticle;
