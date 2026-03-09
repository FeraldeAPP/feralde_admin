import { createRoute } from '@tanstack/react-router';
import DistributorsPage from './pages/DistributorsPage';
import DistributorDetailPage from './pages/DistributorDetailPage';
import { adminShellRoute } from '@/routes/layouts';

export const distributorsRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributors', component: DistributorsPage });
export const distributorDetailRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributors/$id', component: DistributorDetailPage });

export const distributorsRoutes = [distributorsRoute, distributorDetailRoute];
