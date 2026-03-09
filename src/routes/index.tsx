import AdminShell from '@/components/AdminShell';
import AuthGuard from '@/components/AuthGuard';
import AccountingPage from '@/features/accounting/pages/AccountingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import BundlesPage from '@/features/bundles/pages/BundlesPage';
import CategoriesPage from '@/features/categories/pages/CategoriesPage';
import CommissionsPage from '@/features/commissions/pages/CommissionsPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import DistributorDetailPage from '@/features/distributors/pages/DistributorDetailPage';
import DistributorsPage from '@/features/distributors/pages/DistributorsPage';
import InventoryPage from '@/features/inventory/pages/InventoryPage';
import LeaderboardPage from '@/features/leaderboard/pages/LeaderboardPage';
import MarketingPage from '@/features/marketing/pages/MarketingPage';
import OrderDetailPage from '@/features/orders/pages/OrderDetailPage';
import OrdersPage from '@/features/orders/pages/OrdersPage';
import CreateProductPage from '@/features/products/pages/CreateProductPage';
import EditProductPage from '@/features/products/pages/EditProductPage';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import ProductsPage from '@/features/products/pages/ProductsPage';
import PromoCodesPage from '@/features/promo-codes/pages/PromoCodesPage';
import ResellersPage from '@/features/resellers/pages/ResellersPage';
import AuditLogsPage from '@/features/system/pages/AuditLogsPage';
import SettingsPage from '@/features/system/pages/SettingsPage';
import TrainingPage from '@/features/training/pages/TrainingPage';
import WalletsPage from '@/features/wallets/pages/WalletsPage';
import UsersPage from '@/features/users/pages/UsersPage';
import RolesPage from '@/features/roles/pages/RolesPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    element: <AuthGuard />,
    children: [
      {
        element: <AdminShell />,
        children: [
          { path: '/', element: <DashboardPage /> },

          // Catalog
          { path: '/products', element: <ProductsPage /> },
          { path: '/products/new', element: <CreateProductPage /> },
          { path: '/products/:id', element: <ProductDetailPage /> },
          { path: '/products/:id/edit', element: <EditProductPage /> },
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/bundles', element: <BundlesPage /> },
          { path: '/promo-codes', element: <PromoCodesPage /> },

          // Commerce
          { path: '/orders', element: <OrdersPage /> },
          { path: '/orders/:id', element: <OrderDetailPage /> },
          { path: '/inventory', element: <InventoryPage /> },

          // Network
          { path: '/distributors', element: <DistributorsPage /> },
          { path: '/distributors/:id', element: <DistributorDetailPage /> },
          { path: '/resellers', element: <ResellersPage /> },
          { path: '/commissions', element: <CommissionsPage /> },

          // Finance
          { path: '/wallets', element: <WalletsPage /> },
          { path: '/accounting', element: <AccountingPage /> },
          { path: '/leaderboard', element: <LeaderboardPage /> },

          // Content
          { path: '/training', element: <TrainingPage /> },
          { path: '/marketing', element: <MarketingPage /> },

          // System
          { path: '/system/settings', element: <SettingsPage /> },
          { path: '/system/audit-logs', element: <AuditLogsPage /> },

          // Management
          { path: '/users', element: <UsersPage /> },
          { path: '/roles', element: <RolesPage /> },
          { path: '/profile', element: <ProfilePage /> },

          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
