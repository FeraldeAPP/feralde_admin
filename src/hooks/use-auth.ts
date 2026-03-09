import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { logout as apiLogout } from '@/api/endpoints';
import type { User } from '@/api/types';

export function useAuth() {
  const { user, isLoading, setUser, setLoading } = useAuthStore();
  const navigate = useNavigate();

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      return Object.values(user.permissions)
        .flatMap((group) => Object.values(group))
        .flat()
        .includes(permission);
    },
    [user],
  );

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      navigate('/login');
    }
  }, [setUser, navigate]);

  return { user, isLoading, hasPermission, signOut, setUser, setLoading } satisfies {
    user: User | null;
    isLoading: boolean;
    hasPermission: (permission: string) => boolean;
    signOut: () => Promise<void>;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
  };
}
