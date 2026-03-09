import { client } from '../client';
import type { ApiResponse } from '../types';
import type { Reseller, ResellerListData } from '../types/network';

export async function getResellers(params?: { page?: number; per_page?: number; search?: string }): Promise<ApiResponse<ResellerListData>> {
  const { data } = await client.get<ApiResponse<ResellerListData>>('/resellers', { params });
  return data;
}

export async function getReseller(id: number): Promise<ApiResponse<Reseller>> {
  const { data } = await client.get<ApiResponse<Reseller>>(`/resellers/${id}`);
  return data;
}

export async function approveReseller(id: number): Promise<ApiResponse<Reseller>> {
  const { data } = await client.post<ApiResponse<Reseller>>(`/resellers/${id}/approve`);
  return data;
}
