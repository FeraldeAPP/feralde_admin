import { useEffect } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from '@/routes';
import { useAuthStore } from '@/stores/auth-store';
import { getMe } from '@/features/auth/api';
import { TooltipProvider } from './components/ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function AuthInitializer() {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.success ? res.data : null);
      })
      .catch(() => setUser(null))
      .finally(() => {
        setLoading(false);
      });
  }, [setUser, setLoading]);

  // Re-evaluate routes whenever the user state changes (login/logout/refresh)
  useEffect(() => {
    router.invalidate();
  }, [user]);

  return null;
}

export default function App() {
  const auth = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <TooltipProvider>
        <RouterProvider router={router} context={{ auth }} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
