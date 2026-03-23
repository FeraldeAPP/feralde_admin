import { createRoute } from '@tanstack/react-router';
import ResellersPage from './pages/ResellersPage';
import ResellerRegistrationPage from './pages/ResellerRegistrationPage';
import { adminShellRoute, rootRoute } from '@/routes/layouts';

export const resellersRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/resellers',
    component: ResellersPage,
});

// Public route -- no auth required.
// Distributor shares this link; prospective resellers use it to apply.
export const resellerRegistrationRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register/reseller/$referralCode',
    component: ResellerRegistrationPage,
});
