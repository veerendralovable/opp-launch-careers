
import { useState, useEffect } from 'react';
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
  const { user } = useAuth();
  const { toast } = useToast();

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('is_admin', {
        _user_id: user.id
      });
      
      if (error) throw error;
      setIsAdmin(data);
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      // First fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id) || []
      })) || [];

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
    }
  };

  const assignRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    if (!user || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role,
          assigned_by: user.id
        }, {
          onConflict: 'user_id,role'
        });

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user.id,
          action_type: 'assign_role',
          target_type: 'user',
          target_id: userId,
          details: { role }
        });

      toast({
        title: "Role Assigned",
        description: `User role has been updated to ${role}.`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeRole = async (userId: string, role: 'user' | 'admin' | 'moderator') => {
    if (!user || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user.id,
          action_type: 'remove_role',
          target_type: 'user',
          target_id: userId,
          details: { role }
        });

      toast({
        title: "Role Removed",
        description: `${role} role has been removed from user.`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Set up real-time subscription for user roles
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('user-roles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return {
    users,
    loading,
    isAdmin,
    assignRole,
    removeRole,
    refetch: fetchUsers
  };
};
