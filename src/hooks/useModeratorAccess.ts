
import { useAuth } from '@/contexts/AuthContext';

export const useModeratorAccess = () => {
  const { userRole } = useAuth();
  
  const hasModeratorAccess = userRole === 'moderator' || userRole === 'admin';
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator';

  return {
    hasModeratorAccess,
    isAdmin,
    isModerator
  };
};
