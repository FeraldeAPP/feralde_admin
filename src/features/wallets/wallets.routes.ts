import { createRoute } from '@tanstack/react-router';
import WalletsPage from './pages/WalletsPage';
import { adminShellRoute } from '@/routes/layouts';

export const walletsRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/wallets',
    component: WalletsPage
});
