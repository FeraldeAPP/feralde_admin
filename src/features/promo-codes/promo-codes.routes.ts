import { createRoute } from '@tanstack/react-router';
import PromoCodesPage from './pages/PromoCodesPage';
import { adminShellRoute } from '@/routes/layouts';

export const promoCodesRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/promo-codes',
    component: PromoCodesPage
});
