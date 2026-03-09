import { client } from '../client';
import type { ApiResponse } from '../types';
import type { Bundle, BundleListData } from '../types/catalog';

export async function getBundles(params?: { page?: number; per_page?: number }): Promise<ApiResponse<BundleListData>> {
  const { data } = await client.get<ApiResponse<BundleListData>>('/bundles', { params });
  return data;
}

export async function getBundle(id: number): Promise<ApiResponse<Bundle>> {
  const { data } = await client.get<ApiResponse<Bundle>>(`/bundles/${id}`);
  return data;
}
