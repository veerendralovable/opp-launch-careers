
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminNavigation from '@/components/AdminNavigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Users, 
  Search, 
  Shield, 
  Crown, 
  User,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];
type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserWithRole extends Profile {
  user_roles: UserRoleRow[];
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useAuth();
  const { toast } = useToast();

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || userRole === 'admin';

  useEffect(() => {
    if (isModerator) {
      fetchUsers();
    }
  }, [isModerator]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

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
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { data, error } = await supabase.rpc('assign_user_role', {
        _user_id: userId,
        _role: newRole
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'moderator':
        return <Crown className="h-4 w-4 text-blue-600" />;
      case 'advertiser':
        return <Megaphone className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>;
      case 'advertiser':
        return <Badge className="bg-green-100 text-green-800">Advertiser</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isModerator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">Moderator privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" message="Loading users..." />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground mt-1">Manage platform users and their roles</p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{users.length} total users</span>
            </div>
          </div>
        </div>
      </div>

      <AdminNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map(user => {
                const userRole = user.user_roles?.[0]?.role || 'user';
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {getRoleIcon(userRole)}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name || 'No name'}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getRoleBadge(userRole)}
                      
                      {isAdmin && (
                        <div className="flex gap-2">
                          {userRole !== 'user' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user.id, 'user')}
                            >
                              Make User
                            </Button>
                          )}
                          {userRole !== 'moderator' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user.id, 'moderator')}
                            >
                              Make Moderator
                            </Button>
                          )}
                          {userRole !== 'advertiser' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user.id, 'advertiser')}
                            >
                              Make Advertiser
                            </Button>
                          )}
                          {userRole !== 'admin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateUserRole(user.id, 'admin')}
                            >
                              Make Admin
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
