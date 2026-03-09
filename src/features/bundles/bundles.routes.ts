import { createRoute } from '@tanstack/react-router';
import BundlesPage from './pages/BundlesPage';
import { adminShellRoute } from '@/routes/layouts';

export const bundlesRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/bundles',
    component: BundlesPage
});
