import { createRoute } from '@tanstack/react-router';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { adminShellRoute } from '@/routes/layouts';

export const ordersRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/orders', component: OrdersPage });
export const orderDetailRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/orders/$id', component: OrderDetailPage });

export const ordersRoutes = [ordersRoute, orderDetailRoute];
