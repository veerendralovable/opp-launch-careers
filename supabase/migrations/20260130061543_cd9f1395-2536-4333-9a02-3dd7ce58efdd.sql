-- First, clean up duplicate roles - keep only the highest priority role per user
-- Priority: admin > moderator > advertiser > user
WITH ranked_roles AS (
  SELECT 
    id,
    user_id,
    role,
    ROW_NUMBER() OVER (
      PARTITION BY user_id 
      ORDER BY 
        CASE role 
          WHEN 'admin' THEN 1 
          WHEN 'moderator' THEN 2 
          WHEN 'advertiser' THEN 3 
          WHEN 'user' THEN 4 
        END
    ) as rn
  FROM public.user_roles
)
DELETE FROM public.user_roles 
WHERE id IN (
  SELECT id FROM ranked_roles WHERE rn > 1
);

-- Add unique constraint on user_id to ensure one role per user
DO $$ 
BEGIN
  -- First drop the old constraint if exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles DROP CONSTRAINT user_roles_user_id_role_key;
  END IF;
  
  -- Add new unique constraint on just user_id
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_unique'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Update assign_user_role function to properly handle role changes
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if caller is admin (skip check if this is the first admin creation)
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    IF NOT public.is_admin(auth.uid()) THEN
      RAISE EXCEPTION 'Only admins can assign roles';
    END IF;
  END IF;
  
  -- Use upsert to handle both insert and update
  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
  VALUES (_user_id, _role, auth.uid(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = EXCLUDED.role, 
    assigned_by = EXCLUDED.assigned_by, 
    assigned_at = now();
  
  -- Log the role change
  INSERT INTO public.security_logs (user_id, event_type, details, severity)
  VALUES (auth.uid(), 'role_assigned', jsonb_build_object(
    'target_user_id', _user_id,
    'new_role', _role,
    'assigned_by', auth.uid()
  ), 'info');
  
  RETURN true;
END;
$$;

-- Update assign_role_secure for self-assignment during registration
CREATE OR REPLACE FUNCTION public.assign_role_secure(_target_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Allow self-assignment for 'user' role during registration
  -- Or admin assignment for any role
  IF (_role = 'user' AND auth.uid() = _target_user_id) OR public.is_admin(auth.uid()) THEN
    INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
    VALUES (_target_user_id, _role, auth.uid(), now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = EXCLUDED.role, 
      assigned_by = EXCLUDED.assigned_by, 
      assigned_at = now();
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create a function to promote a user to admin (can be called by existing admins)
CREATE OR REPLACE FUNCTION public.promote_to_admin(_target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only existing admins can promote others
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can promote users to admin';
  END IF;
  
  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
  VALUES (_target_user_id, 'admin', auth.uid(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'admin', 
    assigned_by = EXCLUDED.assigned_by, 
    assigned_at = now();
  
  -- Log the promotion
  INSERT INTO public.security_logs (user_id, event_type, details, severity)
  VALUES (auth.uid(), 'admin_promotion', jsonb_build_object(
    'target_user_id', _target_user_id,
    'promoted_by', auth.uid()
  ), 'warning');
  
  RETURN true;
END;
$$;

-- Create a function to set initial admin via database (for first admin setup)
-- This bypasses the admin check since there are no admins yet
CREATE OR REPLACE FUNCTION public.make_admin_direct(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
  VALUES (_user_id, 'admin', _user_id, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'admin', 
    assigned_by = EXCLUDED.assigned_by, 
    assigned_at = now();
  
  -- Log the event
  INSERT INTO public.security_logs (user_id, event_type, details, severity)
  VALUES (_user_id, 'admin_created_direct', jsonb_build_object(
    'user_id', _user_id,
    'method', 'make_admin_direct'
  ), 'warning');
  
  RETURN true;
END;
$$;

-- Update get_user_role to return the role properly
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles WHERE user_id = _user_id),
    'user'::app_role
  );
$$;