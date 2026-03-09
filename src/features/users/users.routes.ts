import { createRoute } from '@tanstack/react-router';
import UsersPage from './pages/UsersPage';
import { adminShellRoute } from '@/routes/layouts';

export const usersRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/users',
    component: UsersPage
});
