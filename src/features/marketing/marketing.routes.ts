import { createRoute } from '@tanstack/react-router';
import MarketingPage from './pages/MarketingPage';
import { adminShellRoute } from '@/routes/layouts';

export const marketingRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/marketing',
    component: MarketingPage
});
