import type { Pagination } from '@/lib/api/types';

export interface SystemSetting {
    id: number;
    key: string;
    value: unknown;
    group: string | null;
    updated_by: string | null;
}

export interface AuditLog {
    id: number;
    user_id: string | null;
    action: string;
    resource: string;
    resource_id: string | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

export interface AuditLogListData {
    logs: AuditLog[];
    pagination: Pagination;
}
