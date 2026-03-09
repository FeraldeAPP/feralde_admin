import { client } from '../client';
import type { ApiResponse } from '../types';
import type { PromoCode, PromoCodeListData, PromoCodeType } from '../types/catalog';

export async function getPromoCodes(params?: { page?: number; per_page?: number }): Promise<ApiResponse<PromoCodeListData>> {
  const { data } = await client.get<ApiResponse<PromoCodeListData>>('/promo-codes', { params });
  return data;
}

export async function getPromoCode(id: number): Promise<ApiResponse<PromoCode>> {
  const { data } = await client.get<ApiResponse<PromoCode>>(`/promo-codes/${id}`);
  return data;
}

export interface CreatePromoCodePayload {
  code: string;
  description?: string | null;
  type: PromoCodeType;
  value: number;
  min_order_amount?: number | null;
  max_discount?: number | null;
  usage_limit?: number | null;
  per_user_limit?: number | null;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}

export type UpdatePromoCodePayload = Partial<CreatePromoCodePayload>;

export async function createPromoCode(payload: CreatePromoCodePayload): Promise<ApiResponse<PromoCode>> {
  const { data } = await client.post<ApiResponse<PromoCode>>('/promo-codes', payload);
  return data;
}

export async function updatePromoCode(id: number, payload: UpdatePromoCodePayload): Promise<ApiResponse<PromoCode>> {
  const { data } = await client.put<ApiResponse<PromoCode>>(`/promo-codes/${id}`, payload);
  return data;
}

export async function deletePromoCode(id: number): Promise<ApiResponse<null>> {
  const { data } = await client.delete<ApiResponse<null>>(`/promo-codes/${id}`);
  return data;
}
