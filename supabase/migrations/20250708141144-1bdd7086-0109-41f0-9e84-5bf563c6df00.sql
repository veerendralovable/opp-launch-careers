
-- Create messages table for live chat system
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users NOT NULL,
  receiver_id UUID REFERENCES auth.users,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'direct',
  room_id TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resume collaboration table
CREATE TABLE public.resume_collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES public.resumes NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  permission TEXT NOT NULL DEFAULT 'view',
  invited_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user presence table
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_page TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create saved searches table (enhanced)
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  notification_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_type TEXT NOT NULL,
  variables JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create file uploads table
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

-- Add RLS policies for resume collaborations
ALTER TABLE public.resume_collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view resume collaborations" 
  ON public.resume_collaborations 
  FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.resumes 
    WHERE resumes.id = resume_collaborations.resume_id 
    AND resumes.user_id = auth.uid()
  ));

CREATE POLICY "Resume owners can manage collaborations" 
  ON public.resume_collaborations 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.resumes 
    WHERE resumes.id = resume_collaborations.resume_id 
    AND resumes.user_id = auth.uid()
  ));

-- Add RLS policies for user presence
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all presence" 
  ON public.user_presence 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own presence" 
  ON public.user_presence 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for saved searches
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved searches" 
  ON public.saved_searches 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Add RLS policies for email templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email templates" 
  ON public.email_templates 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Add RLS policies for file uploads
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own file uploads" 
  ON public.file_uploads 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Enable realtime for tables
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.resume_collaborations REPLICA IDENTITY FULL;
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.applications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.resume_collaborations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;

-- Create function to update user presence
CREATE OR REPLACE FUNCTION public.update_user_presence(
  _status TEXT DEFAULT 'online',
  _current_page TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_presence (user_id, status, current_page, metadata, last_seen)
  VALUES (auth.uid(), _status, _current_page, _metadata, now())
  ON CONFLICT (user_id) DO UPDATE SET
    status = _status,
    current_page = _current_page,
    metadata = _metadata,
    last_seen = now();
END;
$$;

-- Create function to get real-time analytics
CREATE OR REPLACE FUNCTION public.get_realtime_analytics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'online_users', (SELECT COUNT(*) FROM public.user_presence WHERE status = 'online' AND last_seen > now() - interval '5 minutes'),
    'total_opportunities', (SELECT COUNT(*) FROM public.opportunities WHERE is_approved = true),
    'total_applications', (SELECT COUNT(*) FROM public.applications),
    'recent_activities', (
      SELECT json_agg(
        json_build_object(
          'type', 'application',
          'title', o.title,
          'created_at', a.applied_at
        )
      )
      FROM public.applications a
      JOIN public.opportunities o ON o.id = a.opportunity_id
      WHERE a.applied_at > now() - interval '1 hour'
      ORDER BY a.applied_at DESC
      LIMIT 10
    )
  ) INTO result;
  
  RETURN result;
END;
$$;
