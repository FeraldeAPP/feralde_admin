import { createRoute } from '@tanstack/react-router';
import RolesPage from './pages/RolesPage';
import { adminShellRoute } from '@/routes/layouts';

export const rolesRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/roles',
    component: RolesPage
});
