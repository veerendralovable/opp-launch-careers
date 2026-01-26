-- =====================================================
-- OPPORTUNITY HUB - COMPLETE DATABASE SCHEMA
-- =====================================================

-- 1. Create ENUM for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'moderator', 'advertiser');

-- =====================================================
-- 2. PROFILES TABLE - User profile information
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  avatar_url TEXT,
  bio TEXT,
  college TEXT DEFAULT '',
  branch TEXT DEFAULT '',
  location TEXT DEFAULT '',
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_level TEXT,
  resume_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- 3. USER_ROLES TABLE - Role-based access control
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. SECURITY DEFINER FUNCTIONS (Must be created before RLS policies that use them)
-- =====================================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  );
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1),
    'user'::app_role
  );
$$;

-- User roles RLS Policies (after functions are created)
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid()) OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE USING (public.is_admin(auth.uid()));

-- =====================================================
-- 5. OPPORTUNITIES TABLE - Main opportunities/jobs listing
-- =====================================================
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- Internship, Job, Scholarship, Contest, etc.
  domain TEXT DEFAULT 'General',
  company TEXT,
  location TEXT,
  remote_work_allowed BOOLEAN DEFAULT false,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_currency TEXT DEFAULT 'USD',
  experience_required TEXT,
  employment_type TEXT, -- Full-time, Part-time, Contract
  deadline DATE,
  source_url TEXT,
  tags TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT false,
  is_expired BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Opportunities RLS Policies
CREATE POLICY "Anyone can view approved opportunities" ON public.opportunities
  FOR SELECT USING (
    is_approved = true OR 
    auth.uid() = submitted_by OR 
    public.is_admin(auth.uid()) OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Authenticated users can submit opportunities" ON public.opportunities
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own pending opportunities" ON public.opportunities
  FOR UPDATE USING (
    auth.uid() = submitted_by OR 
    public.is_admin(auth.uid()) OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Only admins and moderators can delete opportunities" ON public.opportunities
  FOR DELETE USING (
    public.is_admin(auth.uid()) OR 
    public.has_role(auth.uid(), 'moderator')
  );

-- =====================================================
-- 6. BOOKMARKS TABLE - User saved opportunities
-- =====================================================
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 7. APPLICATIONS TABLE - Job/opportunity applications
-- =====================================================
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewing, accepted, rejected
  cover_letter TEXT,
  resume_url TEXT,
  notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications" ON public.applications
  FOR SELECT USING (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid()) OR 
    public.has_role(auth.uid(), 'moderator')
  );

CREATE POLICY "Users can create their own applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 8. NOTIFICATIONS TABLE - User notifications
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, success, warning, error
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System and admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 9. SAVED_SEARCHES TABLE - User saved search queries
-- =====================================================
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL DEFAULT '{}',
  notification_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches" ON public.saved_searches
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 10. ANALYTICS TABLE - Usage tracking
-- =====================================================
CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view analytics" ON public.analytics
  FOR SELECT USING (public.is_admin(auth.uid()));

-- =====================================================
-- 11. SECURITY_LOGS TABLE - Security event logging
-- =====================================================
CREATE TABLE public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  severity TEXT NOT NULL DEFAULT 'info', -- info, warning, error, critical
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view security logs" ON public.security_logs
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert security logs" ON public.security_logs
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 12. EMAIL_NOTIFICATIONS TABLE - Bulk email campaigns
-- =====================================================
CREATE TABLE public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all', -- all, admins, moderators, users
  status TEXT DEFAULT 'draft', -- draft, sending, sent, failed
  sent_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage email notifications" ON public.email_notifications
  FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================
-- 13. PLATFORM_SETTINGS TABLE - App configuration
-- =====================================================
CREATE TABLE public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platform settings" ON public.platform_settings
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify platform settings" ON public.platform_settings
  FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================
-- 14. HELPER FUNCTIONS
-- =====================================================

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type TEXT,
  _details JSONB DEFAULT '{}',
  _severity TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.security_logs (user_id, event_type, details, severity)
  VALUES (auth.uid(), _event_type, _details, _severity)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to securely assign roles (for initial admin setup and role assignment)
CREATE OR REPLACE FUNCTION public.assign_role_secure(
  _target_user_id UUID,
  _role app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow self-assignment for 'user' role, or admin assignment for any role
  IF _role = 'user' OR public.is_admin(auth.uid()) THEN
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (_target_user_id, _role, auth.uid())
    ON CONFLICT (user_id, role) 
    DO UPDATE SET role = EXCLUDED.role, assigned_by = EXCLUDED.assigned_by, assigned_at = now();
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Function for admins to assign any role
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id UUID,
  _role app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can assign roles
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can assign roles';
  END IF;
  
  -- Delete existing role first
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  
  -- Insert new role
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (_user_id, _role, auth.uid());
  
  RETURN true;
END;
$$;

-- Function to send bulk notifications
CREATE OR REPLACE FUNCTION public.send_bulk_notification(
  _title TEXT,
  _message TEXT,
  _type TEXT DEFAULT 'info',
  _target_role app_role DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_count INTEGER := 0;
BEGIN
  -- Only admins can send bulk notifications
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can send bulk notifications';
  END IF;
  
  IF _target_role IS NULL THEN
    -- Send to all users
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT id, _title, _message, _type
    FROM public.profiles;
  ELSE
    -- Send to users with specific role
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT ur.user_id, _title, _message, _type
    FROM public.user_roles ur
    WHERE ur.role = _target_role;
  END IF;
  
  GET DIAGNOSTICS notification_count = ROW_COUNT;
  RETURN notification_count;
END;
$$;

-- =====================================================
-- 15. TRIGGERS
-- =====================================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 16. INDEXES for Performance
-- =====================================================
CREATE INDEX idx_opportunities_type ON public.opportunities(type);
CREATE INDEX idx_opportunities_domain ON public.opportunities(domain);
CREATE INDEX idx_opportunities_approved ON public.opportunities(is_approved);
CREATE INDEX idx_opportunities_expired ON public.opportunities(is_expired);
CREATE INDEX idx_opportunities_featured ON public.opportunities(featured);
CREATE INDEX idx_opportunities_deadline ON public.opportunities(deadline);
CREATE INDEX idx_opportunities_created_at ON public.opportunities(created_at DESC);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX idx_applications_user ON public.applications(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at DESC);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at DESC);