
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, MailOpen, Trash2, Clock } from 'lucide-react';
import SEO from '@/components/SEO';
import BackButton from '@/components/BackButton';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !currentStatus, responded_at: !currentStatus ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) throw error;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      setMessages(prev => prev.filter(m => m.id !== id));
      toast({ title: "Deleted", description: "Message deleted" });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-0">
      <SEO title="Contact Messages - Admin" description="Manage contact form submissions" />
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BackButton />
          <div className="flex items-center gap-3 mt-4">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6">
          {(['all', 'unread', 'read'] as const).map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card><CardContent className="pt-6 text-center text-muted-foreground">No messages found</CardContent></Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(msg => (
              <Card key={msg.id} className={!msg.is_read ? 'border-primary/30 bg-primary/5' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {!msg.is_read ? <Mail className="h-4 w-4 text-primary" /> : <MailOpen className="h-4 w-4 text-muted-foreground" />}
                        <h3 className="font-semibold text-foreground">{msg.subject}</h3>
                        <Badge variant="outline">{msg.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{msg.name} — <a href={`mailto:${msg.email}`} className="text-primary hover:underline">{msg.email}</a></p>
                      <p className="text-sm text-foreground mt-2">{msg.message}</p>
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleRead(msg.id, msg.is_read)}>
                        {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteMessage(msg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactMessages;
