import { createRoute } from '@tanstack/react-router';
import TrainingPage from './pages/TrainingPage';
import { adminShellRoute } from '@/routes/layouts';

export const trainingRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/training',
    component: TrainingPage
});
