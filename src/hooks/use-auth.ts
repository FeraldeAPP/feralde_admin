import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth-store';
import { logout as apiLogout } from '@/features/auth/api';
import type { User } from '@/features/auth/types';

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
      navigate({ to: '/login' });
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

