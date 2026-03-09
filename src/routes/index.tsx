import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import AdminShell from '@/components/AdminShell';
import LoginPage from '@/features/auth/pages/LoginPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import ProductsPage from '@/features/products/pages/ProductsPage';
import ProductDetailPage from '@/features/products/pages/ProductDetailPage';
import CreateProductPage from '@/features/products/pages/CreateProductPage';
import EditProductPage from '@/features/products/pages/EditProductPage';
import CategoriesPage from '@/features/categories/pages/CategoriesPage';
import BundlesPage from '@/features/bundles/pages/BundlesPage';
import PromoCodesPage from '@/features/promo-codes/pages/PromoCodesPage';
import OrdersPage from '@/features/orders/pages/OrdersPage';
import InventoryPage from '@/features/inventory/pages/InventoryPage';
import DistributorsPage from '@/features/distributors/pages/DistributorsPage';
import DistributorDetailPage from '@/features/distributors/pages/DistributorDetailPage';
import ResellersPage from '@/features/resellers/pages/ResellersPage';
import CommissionsPage from '@/features/commissions/pages/CommissionsPage';
import WalletsPage from '@/features/wallets/pages/WalletsPage';
import AccountingPage from '@/features/accounting/pages/AccountingPage';
import LeaderboardPage from '@/features/leaderboard/pages/LeaderboardPage';
import TrainingPage from '@/features/training/pages/TrainingPage';
import MarketingPage from '@/features/marketing/pages/MarketingPage';
import SettingsPage from '@/features/system/pages/SettingsPage';
import AuditLogsPage from '@/features/system/pages/AuditLogsPage';

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

          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
