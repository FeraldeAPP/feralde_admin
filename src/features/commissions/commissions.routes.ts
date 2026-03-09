import { createRoute } from '@tanstack/react-router';
import CommissionsPage from './pages/CommissionsPage';
import { adminShellRoute } from '@/routes/layouts';

export const commissionsRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/commissions',
    component: CommissionsPage
});
