import { Outlet } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth-store';
import { useNavigate } from '@tanstack/react-router';

const ADMIN_ROLES = ['admin', 'super-admin'];

export default function AuthGuard() {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    navigate({ to: '/login' });
    return null;
  }

  const isAdmin = user.roles.some((r) => ADMIN_ROLES.includes(r.name));

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-gray-700 font-medium">Access denied</p>
          <p className="text-sm text-gray-500">You do not have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
