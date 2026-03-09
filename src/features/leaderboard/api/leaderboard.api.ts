import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { LeaderboardData } from '../types';

export async function getLeaderboard(params?: { period?: string }): Promise<ApiResponse<LeaderboardData>> {
    const { data } = await client.get<ApiResponse<LeaderboardData>>('/system/leaderboard', { params });
    return data;
}
