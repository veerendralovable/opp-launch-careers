
-- Fix RLS policies to allow proper role management and data access

-- Drop existing problematic policies on user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can assign roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

-- Create proper RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- Drop and recreate opportunities policies
DROP POLICY IF EXISTS "Opportunities are viewable by everyone" ON public.opportunities;
DROP POLICY IF EXISTS "Authenticated users can insert opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update own opportunities or admins can update any" ON public.opportunities;

CREATE POLICY "Anyone can view approved opportunities" 
  ON public.opportunities 
  FOR SELECT 
  USING (is_approved = true);

CREATE POLICY "Moderators can view all opportunities" 
  ON public.opportunities 
  FOR SELECT 
  USING (
    public.has_role(auth.uid(), 'moderator') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Authenticated users can submit opportunities" 
  ON public.opportunities 
  FOR INSERT 
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Moderators can update opportunities" 
  ON public.opportunities 
  FOR UPDATE 
  USING (
    public.has_role(auth.uid(), 'moderator') OR 
    public.has_role(auth.uid(), 'admin')
  );

-- Drop and recreate profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Moderators can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    public.has_role(auth.uid(), 'moderator') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Drop existing analytics policies and create new ones
DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics;

CREATE POLICY "Admins can view analytics" 
  ON public.analytics 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Drop existing notifications policies and create new ones
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

CREATE POLICY "Users can view notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage notifications" 
  ON public.notifications 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Create a more robust role assignment function
CREATE OR REPLACE FUNCTION public.assign_user_role_secure(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete existing role for this user
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    
    -- Insert new role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (_user_id, _role, COALESCE(auth.uid(), _user_id));
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;
