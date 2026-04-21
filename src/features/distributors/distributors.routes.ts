import { createRoute } from '@tanstack/react-router';
import DistributorsPage from './pages/DistributorsPage';
import DistributorDetailPage from './pages/DistributorDetailPage';
import Dashboard from './pages/main/Dashboard';
import OrdersPage from './pages/main/OrdersPage';
import InventoryLayout from './pages/main/inventory/InventoryLayout';
import OverviewPage from './pages/main/inventory/OverviewPage';
import ProductInventoryPage from './pages/main/inventory/ProductInventoryPage';
import MovementPage from './pages/main/inventory/MovementPage';
import AllocationPage from './pages/main/inventory/AllocationPage';
import ReorderPage from './pages/main/inventory/ReorderPage';
import ResellersPage from './pages/main/ResellersPage';
import MarketingPage from './pages/main/MarketingPage';
import TrainingPage from './pages/main/TrainingPage';
import AnnouncementsPage from './pages/main/AnnouncementsPage';
import WalletPage from './pages/main/WalletPage';
import MakeOrderPage from './pages/main/MakeOrderPage';
import { adminShellRoute, authGuardRoute } from '@/routes/layouts';
import OnboardingPage from './pages/onboarding/OnboardingPage';

export const distributorsRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributors', component: DistributorsPage });
export const distributorDetailRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributors/$id', component: DistributorDetailPage });
export const distributorDashboardRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor', component: Dashboard });

// NEW Distributor Routes
export const distributorOrdersRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/orders', component: OrdersPage });

// Inventory Routes (Nested)
export const distributorInventoryRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/inventory', component: InventoryLayout });
export const distributorInventoryIndexRoute = createRoute({ getParentRoute: () => distributorInventoryRoute, path: '/', component: OverviewPage });
export const distributorInventoryProductsRoute = createRoute({ getParentRoute: () => distributorInventoryRoute, path: '/products', component: ProductInventoryPage });
export const distributorInventoryMovementRoute = createRoute({ getParentRoute: () => distributorInventoryRoute, path: '/movement', component: MovementPage });
export const distributorInventoryAllocationRoute = createRoute({ getParentRoute: () => distributorInventoryRoute, path: '/allocation', component: AllocationPage });
export const distributorInventoryReorderRoute = createRoute({ getParentRoute: () => distributorInventoryRoute, path: '/reorder', component: ReorderPage });

export const distributorResellersRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/resellers', component: ResellersPage });
export const distributorMarketingRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/marketing', component: MarketingPage });
export const distributorTrainingRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/training', component: TrainingPage });
export const distributorAnnouncementsRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/announcements', component: AnnouncementsPage });
export const distributorWalletRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/wallet', component: WalletPage });
export const distributorMakeOrderRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/distributor/orders/make', component: MakeOrderPage });

export const onboardingRoute = createRoute({ getParentRoute: () => authGuardRoute, path: '/onboarding', component: OnboardingPage });

export const distributorsRoutes = [
    distributorsRoute,
    distributorDetailRoute,
    distributorDashboardRoute,
    distributorOrdersRoute,
    distributorInventoryRoute.addChildren([
        distributorInventoryIndexRoute,
        distributorInventoryProductsRoute,
        distributorInventoryMovementRoute,
        distributorInventoryAllocationRoute,
        distributorInventoryReorderRoute,
    ]),
    distributorResellersRoute,
    distributorMarketingRoute,
    distributorTrainingRoute,
    distributorAnnouncementsRoute,
    distributorWalletRoute,
    distributorMakeOrderRoute,
];
