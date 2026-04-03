import { createRoute } from '@tanstack/react-router';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import EditProductPage from './pages/EditProductPage';
import { adminShellRoute } from '@/routes/layouts';

export const productsRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/products', component: ProductsPage });
export const createProductRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/products/new', component: CreateProductPage });
export const productDetailRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/products/$id', component: ProductDetailPage });
export const editProductRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/products/$id/edit', component: EditProductPage });

export const productsRoutes = [
    productsRoute,
    createProductRoute,
    productDetailRoute,
    editProductRoute,
];
