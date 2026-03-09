import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { SystemSetting, AuditLogListData } from '../types';

export async function getSystemSettings(): Promise<ApiResponse<SystemSetting[]>> {
    const { data } = await client.get<ApiResponse<SystemSetting[]>>('/system/settings');
    return data;
}

export async function getAuditLogs(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AuditLogListData>> {
    const { data } = await client.get<ApiResponse<AuditLogListData>>('/system/audit-logs', { params });
    return data;
}
