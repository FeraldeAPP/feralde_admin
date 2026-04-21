import { createRootRouteWithContext, createRoute, Outlet, redirect } from '@tanstack/react-router';
import AdminShell from '@/components/AdminShell.new';
import AuthGuard from '@/components/AuthGuard';
import type { AuthState } from '@/stores/auth-store';

interface MyRouterContext {
    auth: AuthState;
}

// Root Route
export const rootRoute = createRootRouteWithContext<MyRouterContext>()({
    component: () => <Outlet />,
});

const ADMIN_ROLES = ['admin', 'super-admin'];

// Auth Guard Layout
export const authGuardRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'auth-guard',
    beforeLoad: ({ context, location }) => {
        const { user, isLoading } = context.auth;

        // If it's still loading, we don't redirect yet.
        // The component (AuthGuard) will show the loading state.
        if (isLoading) {
            return;
        }

        // Redirect to login if not authenticated
        if (!user) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }

        // Check for admin/distributor role
        const isAdmin = user.roles.some((r: any) => ADMIN_ROLES.includes(r.name));
        const isDistributor = user.account_type === 'distributor';

        if (!isAdmin && !isDistributor) {
            // For now, we still allow the component to render the "Access Denied" UI
            // but we could also redirect to an unauthorized page here.
            return;
        }

        // Restrict distributors dynamically in beforeLoad
        if (isDistributor && !location.pathname.startsWith('/distributor') && !location.pathname.startsWith('/onboarding')) {
            throw redirect({
                to: '/distributor',
            });
        }
    },
    component: AuthGuard,
});

// Admin Shell Layout
export const adminShellRoute = createRoute({
    getParentRoute: () => authGuardRoute,
    id: 'admin-shell',
    component: AdminShell,
});

