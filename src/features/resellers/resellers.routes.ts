import { createRoute } from '@tanstack/react-router';
import ResellersPage from './pages/ResellersPage';
import { adminShellRoute } from '@/routes/layouts';

export const resellersRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/resellers',
    component: ResellersPage
});
