
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

interface ApplyModalProps {
  opportunityId: string;
  opportunityTitle: string;
  disabled?: boolean;
}

const ApplyModal = ({ opportunityId, opportunityTitle, disabled }: ApplyModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const checkExisting = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('opportunity_id', opportunityId)
      .maybeSingle();
    setAlreadyApplied(!!data);
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) checkExisting();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to apply.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        opportunity_id: opportunityId,
        cover_letter: coverLetter.trim() || null,
        resume_url: resumeUrl.trim() || null,
        notes: notes.trim() || null,
        status: 'pending',
      });

      if (error) throw error;

      toast({ title: 'Application submitted!', description: `You've applied to "${opportunityTitle}".` });
      setOpen(false);
      setCoverLetter('');
      setResumeUrl('');
      setNotes('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to submit application', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Button className="w-full" size="lg" disabled={disabled} onClick={() => toast({ title: 'Sign in required', description: 'Please sign in to apply.', variant: 'destructive' })}>
        <Send className="h-4 w-4 mr-2" />
        Apply Now
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg" disabled={disabled}>
          <Send className="h-4 w-4 mr-2" />
          {disabled ? 'Opportunity Expired' : 'Apply Now'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to {opportunityTitle}</DialogTitle>
          <DialogDescription>Submit your application for this opportunity.</DialogDescription>
        </DialogHeader>

        {alreadyApplied ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You've already applied to this opportunity.</p>
            <Button variant="outline" className="mt-4" onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit..."
                rows={4}
                maxLength={2000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL (optional)</Label>
              <Input
                id="resumeUrl"
                type="url"
                value={resumeUrl}
                onChange={e => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any additional information..."
                rows={2}
                maxLength={500}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
