import { createRoute } from '@tanstack/react-router';
import LeaderboardPage from './pages/LeaderboardPage';
import { adminShellRoute } from '@/routes/layouts';

export const leaderboardRoute = createRoute({
    getParentRoute: () => adminShellRoute,
    path: '/leaderboard',
    component: LeaderboardPage
});
