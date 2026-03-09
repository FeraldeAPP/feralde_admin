import { client } from '../client';
import type { ApiResponse } from '../types';
import type { SystemSetting, AuditLogListData, LeaderboardData } from '../types';

export async function getSystemSettings(): Promise<ApiResponse<SystemSetting[]>> {
  const { data } = await client.get<ApiResponse<SystemSetting[]>>('/system/settings');
  return data;
}

export async function getAuditLogs(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AuditLogListData>> {
  const { data } = await client.get<ApiResponse<AuditLogListData>>('/system/audit-logs', { params });
  return data;
}

export async function getLeaderboard(params?: { period?: string }): Promise<ApiResponse<LeaderboardData>> {
  const { data } = await client.get<ApiResponse<LeaderboardData>>('/system/leaderboard', { params });
  return data;
}
