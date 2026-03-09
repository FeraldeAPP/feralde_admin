import { createRoute, redirect } from '@tanstack/react-router';
import LoginPage from './pages/LoginPage';
import { rootRoute } from '@/routes/layouts';

import { z } from 'zod';

const loginSearchSchema = z.object({
    redirect: z.string().optional(),
});

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    validateSearch: loginSearchSchema,
    beforeLoad: ({ context, search }) => {
        if (context.auth.user) {
            // If the user is already logged in, send them to the redirect target or dashboard
            const target = search.redirect || '/';
            // Safety check: ensure target is a string and potentially a relative path
            const safeTarget = typeof target === 'string' && target.startsWith('/') ? target : '/';

            throw redirect({
                to: safeTarget,
            });
        }
    },
    component: LoginPage,
});
