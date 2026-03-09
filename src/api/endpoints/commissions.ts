import { client } from '../client';
import type { ApiResponse } from '../types';
import type { Commission, CommissionListData } from '../types/network';

export async function getCommissions(params?: { page?: number; per_page?: number; status?: string }): Promise<ApiResponse<CommissionListData>> {
  const { data } = await client.get<ApiResponse<CommissionListData>>('/commissions', { params });
  return data;
}

export async function getCommission(id: number): Promise<ApiResponse<Commission>> {
  const { data } = await client.get<ApiResponse<Commission>>(`/commissions/${id}`);
  return data;
}
