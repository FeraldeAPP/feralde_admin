import { createRouter, createRoute, Navigate } from '@tanstack/react-router';
import { rootRoute, authGuardRoute, adminShellRoute } from './layouts';

// Feature Routes
import { loginRoute } from '@/features/auth/auth.routes';
import { dashboardRoute } from '@/features/dashboard/dashboard.routes';
import { productsRoutes } from '@/features/products/products.routes';
import { categoriesRoute } from '@/features/categories/categories.routes';
import { bundlesRoute } from '@/features/bundles/bundles.routes';
import { promoCodesRoute } from '@/features/promo-codes/promo-codes.routes';
import { ordersRoutes } from '@/features/orders/orders.routes';
import { inventoryRoute } from '@/features/inventory/inventory.routes';
import { distributorsRoutes } from '@/features/distributors/distributors.routes';
import { resellersRoute } from '@/features/resellers/resellers.routes';
import { commissionsRoute } from '@/features/commissions/commissions.routes';
import { walletsRoute } from '@/features/wallets/wallets.routes';
import { accountingRoute } from '@/features/accounting/accounting.routes';
import { leaderboardRoute } from '@/features/leaderboard/leaderboard.routes';
import { trainingRoute } from '@/features/training/training.routes';
import { marketingRoute } from '@/features/marketing/marketing.routes';
import { systemRoutes } from '@/features/system/system.routes';
import { usersRoute } from '@/features/users/users.routes';
import { rolesRoute } from '@/features/roles/roles.routes';
import { profileRoute } from '@/features/profile/profile.routes';

// Catch-all
const catchAllRoute = createRoute({
  getParentRoute: () => adminShellRoute,
  path: '*',
  component: () => <Navigate to="/" replace />,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authGuardRoute.addChildren([
    adminShellRoute.addChildren([
      dashboardRoute,
      ...productsRoutes,
      categoriesRoute,
      bundlesRoute,
      promoCodesRoute,
      ...ordersRoutes,
      inventoryRoute,
      ...distributorsRoutes,
      resellersRoute,
      commissionsRoute,
      walletsRoute,
      accountingRoute,
      leaderboardRoute,
      trainingRoute,
      marketingRoute,
      ...systemRoutes,
      usersRoute,
      rolesRoute,
      profileRoute,
      catchAllRoute,
    ]),
  ]),
]);

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Re-export layouts for convenience where absolute imports might still point here
export { rootRoute, authGuardRoute, adminShellRoute };
