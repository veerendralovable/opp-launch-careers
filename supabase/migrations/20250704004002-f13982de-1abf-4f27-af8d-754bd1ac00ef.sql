
-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policy for avatar uploads
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for avatar access
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Create policy for avatar updates
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for avatar deletion
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add new columns to profiles table for enhanced functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'entry',
ADD COLUMN IF NOT EXISTS preferred_job_types TEXT[],
ADD COLUMN IF NOT EXISTS preferred_locations TEXT[],
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "marketing": false}'::jsonb,
ADD COLUMN IF NOT EXISTS profile_completion_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create function to calculate profile completion score
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_row profiles)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
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
$$;

-- Create trigger to automatically update profile completion score
CREATE OR REPLACE FUNCTION update_profile_completion_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.profile_completion_score := calculate_profile_completion(NEW);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS profile_completion_trigger ON public.profiles;
CREATE TRIGGER profile_completion_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_completion_trigger();

-- Update existing profiles to calculate completion scores
UPDATE public.profiles 
SET profile_completion_score = calculate_profile_completion(profiles.*);
