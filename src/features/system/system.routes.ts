import { createRoute } from '@tanstack/react-router';
import SettingsPage from './pages/SettingsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import { adminShellRoute } from '@/routes/layouts';

export const settingsRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/system/settings', component: SettingsPage });
export const auditLogsRoute = createRoute({ getParentRoute: () => adminShellRoute, path: '/system/audit-logs', component: AuditLogsPage });

export const systemRoutes = [settingsRoute, auditLogsRoute];
