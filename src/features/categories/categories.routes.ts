import { createRoute } from '@tanstack/react-router';
import CategoriesPage from './pages/CategoriesPage';
import { adminShellRoute } from '@/routes/layouts';

export const categoriesRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/categories',
    component: CategoriesPage
});
