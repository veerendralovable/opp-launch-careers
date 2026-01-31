-- Fix the handle_new_user function to ensure it works correctly
-- The function already has SECURITY DEFINER, but let's ensure it's set up correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Assign default 'user' role using SECURITY DEFINER to bypass RLS
  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
  VALUES (NEW.id, 'user', NEW.id, now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

-- Allow the trigger function to properly assign roles by updating the RLS policy
-- to allow self-assignment of 'user' role during registration
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- Create a more permissive INSERT policy that allows:
-- 1. Admins to insert any role
-- 2. Users to self-assign 'user' role (for registration)
-- 3. The trigger function (SECURITY DEFINER) to bypass RLS
CREATE POLICY "Allow role insertion" ON public.user_roles
FOR INSERT WITH CHECK (
  is_admin(auth.uid()) OR 
  (auth.uid() = user_id AND role = 'user'::app_role)
);

-- Also update the assign_role_secure function to be more robust
CREATE OR REPLACE FUNCTION public.assign_role_secure(_target_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Allow self-assignment for 'user' role during registration
  -- Or admin assignment for any role
  IF (_role = 'user' AND (auth.uid() = _target_user_id OR auth.uid() IS NULL)) 
     OR public.is_admin(auth.uid()) THEN
    INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
    VALUES (_target_user_id, _role, COALESCE(auth.uid(), _target_user_id), now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = EXCLUDED.role, 
      assigned_by = EXCLUDED.assigned_by, 
      assigned_at = now();
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$function$;

-- Create a function to increment view count that works for both authenticated and anonymous users
CREATE OR REPLACE FUNCTION public.increment_view_count(_opportunity_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.opportunities
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = _opportunity_id AND is_approved = true;
END;
$function$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_view_count(uuid) TO authenticated;