import { createRoute } from '@tanstack/react-router';
import AccountingPage from './pages/AccountingPage';
import { adminShellRoute } from '@/routes/layouts';

export const accountingRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/accounting',
    component: AccountingPage
});
