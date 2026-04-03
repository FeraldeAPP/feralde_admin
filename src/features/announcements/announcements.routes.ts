import { createRoute } from '@tanstack/react-router';
import AnnouncementsPage from './pages/AnnouncementsPage';
import { adminShellRoute } from '@/routes/layouts';

export const announcementsRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/announcements',
    component: AnnouncementsPage
});
