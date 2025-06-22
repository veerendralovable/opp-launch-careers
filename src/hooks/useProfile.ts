
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const fetchingRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    if (!user || fetchingRef.current) {
      if (!user) {
        setProfile(null);
        setLoading(false);
        setInitialized(true);
      }
      return;
    }

    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(null);
      
      console.log('Fetching profile for user:', user.id);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        setError(fetchError.message);
        return;
      }

      if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        console.log('Profile not found, creating new profile');
        const newProfile = {
          id: user.id,
          email: user.email || '',
          name: '',
          college: '',
          branch: '',
          location: '',
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          setError(createError.message);
          return;
        }

        console.log('Profile created successfully:', createdProfile);
        setProfile(createdProfile);
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      setError(error.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
      setInitialized(true);
      fetchingRef.current = false;
    }
  }, [user?.id]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile || fetchingRef.current) return false;

    try {
      setLoading(true);
      setError(null);

      console.log('Updating profile for user:', user.id);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }

      console.log('Profile updated successfully');
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      // Refresh profile data
      await fetchProfile();
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when user is available and not already initialized
  useEffect(() => {
    if (user && !initialized) {
      fetchProfile();
    } else if (!user) {
      setProfile(null);
      setError(null);
      setInitialized(true);
    }
  }, [user?.id, initialized, fetchProfile]);

  return {
    profile,
    loading: loading && !initialized,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
};
