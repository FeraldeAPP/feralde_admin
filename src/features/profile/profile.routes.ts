import { createRoute } from '@tanstack/react-router';
import ProfilePage from './pages/ProfilePage';
import { adminShellRoute } from '@/routes/layouts';

export const profileRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/profile',
    component: ProfilePage
});
