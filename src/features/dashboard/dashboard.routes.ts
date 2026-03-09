import { createRoute } from '@tanstack/react-router';
import DashboardPage from './pages/DashboardPage';
import { adminShellRoute } from '@/routes/layouts';

export const dashboardRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/',
    component: DashboardPage,
});
