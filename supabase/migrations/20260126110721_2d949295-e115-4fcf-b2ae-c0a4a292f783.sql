-- Fix security warnings: Update permissive RLS policies

-- 1. Fix analytics INSERT policy - require authenticated user
DROP POLICY IF EXISTS "Users can insert analytics" ON public.analytics;
CREATE POLICY "Authenticated users can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Fix security_logs INSERT policy - require authenticated user or service role
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;
CREATE POLICY "Authenticated users can insert security logs" ON public.security_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Fix update_updated_at_column function to include search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. Fix handle_new_user function - already has search_path set

-- 5. Add a function to create the first admin (one-time setup)
CREATE OR REPLACE FUNCTION public.create_first_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  -- Check if any admin exists
  SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  
  -- Only allow if no admins exist
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Log the event
    INSERT INTO public.security_logs (user_id, event_type, details, severity)
    VALUES (_user_id, 'first_admin_created', '{"method": "create_first_admin"}'::jsonb, 'info');
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;