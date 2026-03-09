import { createRoute } from '@tanstack/react-router';
import InventoryPage from './pages/InventoryPage';
import { adminShellRoute } from '@/routes/layouts';

export const inventoryRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/inventory',
    component: InventoryPage
});
