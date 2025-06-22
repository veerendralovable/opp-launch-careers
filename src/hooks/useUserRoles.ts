
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Tables']['user_roles']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserWithRole extends Profile {
  user_roles: UserRole[];
}

export const useUserRoles = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const fetchInProgressRef = useRef(false);

  const checkUserStatus = useCallback(async () => {
    if (!user || fetchInProgressRef.current) return;
    
    try {
      fetchInProgressRef.current = true;
      console.log('Checking user status for:', user.id);

      // Check admin status using secure function
      const { data: adminData, error: adminError } = await supabase.rpc('is_admin', {
        _user_id: user.id
      });
      
      if (adminError) {
        console.error('Error checking admin status:', adminError);
        setIsAdmin(false);
      } else {
        setIsAdmin(adminData || false);
      }

      // Check moderator status using secure function
      const { data: moderatorData, error: moderatorError } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'moderator'
      });
      
      if (moderatorError) {
        console.error('Error checking moderator status:', moderatorError);
        setIsModerator(false);
      } else {
        setIsModerator(moderatorData || false);
      }

      console.log('User status checked - Admin:', adminData, 'Moderator:', moderatorData);
    } catch (error: any) {
      console.error('Error checking user status:', error);
      setIsAdmin(false);
      setIsModerator(false);
    } finally {
      fetchInProgressRef.current = false;
    }
  }, [user?.id]);

  const fetchUsers = useCallback(async () => {
    if ((!isAdmin && !isModerator) || fetchInProgressRef.current) return;

    setLoading(true);
    try {
      fetchInProgressRef.current = true;
      console.log('Fetching users for management');

      // Fetch profiles (public data)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Fetch user roles (with RLS protection)
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      // Combine the data
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id) || []
      })) || [];

      console.log('Users fetched successfully:', usersWithRoles.length);
      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [isAdmin, isModerator, toast]);

  const assignRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    if (!user || (!isAdmin && !isModerator)) return;

    // Only admins can assign admin roles
    if (role === 'admin' && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can assign admin roles.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Assigning role:', role, 'to user:', userId);

      // Use the secure database function for role assignment
      const { error } = await supabase.rpc('assign_user_role', {
        _user_id: userId,
        _role: role
      });

      if (error) throw error;

      toast({
        title: "Role Assigned",
        description: `User role has been updated to ${role}.`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    if (!user || (!isAdmin && !isModerator)) return;

    // Only admins can remove admin roles
    if (role === 'admin' && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only admins can remove admin roles.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Removing role:', role, 'from user:', userId);

      // Assign 'user' role instead of removing (ensures every user has a role)
      const { error } = await supabase.rpc('assign_user_role', {
        _user_id: userId,
        _role: 'user'
      });

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "User role has been set to regular user.",
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  // Check user status when user changes
  useEffect(() => {
    if (user && !initialized) {
      checkUserStatus().then(() => setInitialized(true));
    } else if (!user) {
      setIsAdmin(false);
      setIsModerator(false);
      setInitialized(true);
    }
  }, [user, initialized, checkUserStatus]);

  // Fetch users when admin/moderator status changes
  useEffect(() => {
    if (initialized && (isAdmin || isModerator)) {
      fetchUsers();
    }
  }, [initialized, isAdmin, isModerator, fetchUsers]);

  // Set up real-time subscription for user roles
  useEffect(() => {
    if (!initialized || (!isAdmin && !isModerator)) return;

    console.log('Setting up user roles real-time subscription');
    const channel = supabase
      .channel('user-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
        },
        (payload) => {
          console.log('User roles changed:', payload);
          setTimeout(() => {
            fetchUsers();
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up user roles subscription');
      supabase.removeChannel(channel);
    };
  }, [initialized, isAdmin, isModerator, fetchUsers]);

  return {
    users,
    loading,
    isAdmin,
    isModerator,
    hasManagementAccess: isAdmin || isModerator,
    assignRole,
    removeRole,
    refetch: fetchUsers
  };
};
