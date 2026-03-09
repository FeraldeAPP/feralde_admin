import { client } from '../client';
import type { ApiResponse } from '../types';
import type { Bundle, BundleItem, BundleListData, BundleType } from '../types/catalog';

export async function getBundles(params?: { page?: number; per_page?: number }): Promise<ApiResponse<BundleListData>> {
  const { data } = await client.get<ApiResponse<BundleListData>>('/bundles', { params });
  return data;
}

export async function getBundle(id: number): Promise<ApiResponse<Bundle>> {
  const { data } = await client.get<ApiResponse<Bundle>>(`/bundles/${id}`);
  return data;
}

export interface CreateBundlePayload {
  name: string;
  description?: string | null;
  type: BundleType;
  image_url?: string | null;
  retail_price: number;
  distributor_price: number;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export type UpdateBundlePayload = Partial<CreateBundlePayload>;

export interface AddBundleItemPayload {
  product_id: number;
  variant_id?: number | null;
  quantity: number;
}

export async function createBundle(payload: CreateBundlePayload): Promise<ApiResponse<Bundle>> {
  const { data } = await client.post<ApiResponse<Bundle>>('/bundles', payload);
  return data;
}

export async function updateBundle(id: number, payload: UpdateBundlePayload): Promise<ApiResponse<Bundle>> {
  const { data } = await client.put<ApiResponse<Bundle>>(`/bundles/${id}`, payload);
  return data;
}

export async function deleteBundle(id: number): Promise<ApiResponse<null>> {
  const { data } = await client.delete<ApiResponse<null>>(`/bundles/${id}`);
  return data;
}

export async function addBundleItem(bundleId: number, payload: AddBundleItemPayload): Promise<ApiResponse<BundleItem>> {
  const { data } = await client.post<ApiResponse<BundleItem>>(`/bundles/${bundleId}/items`, payload);
  return data;
}

export async function removeBundleItem(bundleId: number, itemId: number): Promise<ApiResponse<null>> {
  const { data } = await client.delete<ApiResponse<null>>(`/bundles/${bundleId}/items/${itemId}`);
  return data;
}
