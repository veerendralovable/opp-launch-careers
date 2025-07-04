
-- Fix function search path security warnings by setting search_path explicitly

-- Fix calculate_profile_completion function
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_row profiles)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Basic info (40 points total)
    IF profile_row.name IS NOT NULL AND profile_row.name != '' THEN
        score := score + 10;
    END IF;
    IF profile_row.email IS NOT NULL AND profile_row.email != '' THEN
        score := score + 10;
    END IF;
    IF profile_row.phone IS NOT NULL AND profile_row.phone != '' THEN
        score := score + 5;
    END IF;
    IF profile_row.location IS NOT NULL AND profile_row.location != '' THEN
        score := score + 5;
    END IF;
    IF profile_row.bio IS NOT NULL AND profile_row.bio != '' THEN
        score := score + 10;
    END IF;
    
    -- Education info (20 points total)
    IF profile_row.college IS NOT NULL AND profile_row.college != '' THEN
        score := score + 10;
    END IF;
    IF profile_row.branch IS NOT NULL AND profile_row.branch != '' THEN
        score := score + 10;
    END IF;
    
    -- Professional info (30 points total)
    IF profile_row.skills IS NOT NULL AND array_length(profile_row.skills, 1) > 0 THEN
        score := score + 10;
    END IF;
    IF profile_row.experience_level IS NOT NULL AND profile_row.experience_level != 'entry' THEN
        score := score + 5;
    END IF;
    IF profile_row.preferred_job_types IS NOT NULL AND array_length(profile_row.preferred_job_types, 1) > 0 THEN
        score := score + 5;
    END IF;
    IF profile_row.linkedin_url IS NOT NULL AND profile_row.linkedin_url != '' THEN
        score := score + 5;
    END IF;
    IF profile_row.portfolio_url IS NOT NULL AND profile_row.portfolio_url != '' THEN
        score := score + 5;
    END IF;
    
    -- Avatar (10 points)
    IF profile_row.avatar_url IS NOT NULL AND profile_row.avatar_url != '' THEN
        score := score + 10;
    END IF;
    
    RETURN score;
END;
$function$;

-- Fix update_profile_completion_trigger function
CREATE OR REPLACE FUNCTION public.update_profile_completion_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.profile_completion_score := calculate_profile_completion(NEW);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$function$;

-- Fix mark_expired_opportunities function
CREATE OR REPLACE FUNCTION public.mark_expired_opportunities()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE public.opportunities 
    SET is_expired = true, updated_at = NOW()
    WHERE deadline < CURRENT_DATE 
    AND is_expired = false;
    
    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$function$;

-- Fix cleanup_recently_viewed function
CREATE OR REPLACE FUNCTION public.cleanup_recently_viewed()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
    cleanup_count INTEGER;
BEGIN
    WITH ranked_views AS (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY viewed_at DESC) as rn
        FROM public.recently_viewed
    )
    DELETE FROM public.recently_viewed 
    WHERE id IN (
        SELECT id FROM ranked_views WHERE rn > 50
    );
    
    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    RETURN cleanup_count;
END;
$function$;

-- Fix update_opportunity_trigger function
CREATE OR REPLACE FUNCTION public.update_opportunity_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    -- Auto-expire if deadline has passed
    IF NEW.deadline < CURRENT_DATE THEN
        NEW.is_expired := true;
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$function$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT public.has_role(_user_id, 'admin')
$function$;

-- Fix log_admin_action function
CREATE OR REPLACE FUNCTION public.log_admin_action(_action_type text, _target_type text, _target_id uuid, _details jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    -- Only allow authenticated users to log actions
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Log the admin action
    INSERT INTO public.admin_actions (
        admin_id,
        action_type,
        target_type,
        target_id,
        details
    ) VALUES (
        auth.uid(),
        _action_type,
        _target_type,
        _target_id,
        _details
    );
END;
$function$;

-- Fix assign_user_role_secure function
CREATE OR REPLACE FUNCTION public.assign_user_role_secure(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
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
$function$;

-- Fix assign_user_role function
CREATE OR REPLACE FUNCTION public.assign_user_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    -- Check if the current user is an admin
    IF NOT public.is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Admin privileges required';
    END IF;
    
    -- Delete existing role for this user (enforce single role per user)
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    
    -- Insert new role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (_user_id, _role, auth.uid());
    
    -- Log the action
    PERFORM public.log_admin_action(
        'assign_role',
        'user',
        _user_id,
        jsonb_build_object('role', _role::text)
    );
    
    RETURN true;
END;
$function$;

-- Fix handle_new_user_role function
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
    RETURN new;
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', ''));
    RETURN new;
END;
$function$;

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;
