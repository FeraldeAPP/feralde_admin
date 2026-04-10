import { createRoute } from '@tanstack/react-router';
import { adminShellRoute } from '@/routes/layouts';
import { ShippingMethodsPage } from './pages/ShippingMethodsPage';

export const shippingMethodsRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/shipping-methods',
    component: ShippingMethodsPage,
});
