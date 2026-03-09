import { client } from '../client';
import type { ApiResponse } from '../types';
import type { PromoCode, PromoCodeListData } from '../types/catalog';

export async function getPromoCodes(params?: { page?: number; per_page?: number }): Promise<ApiResponse<PromoCodeListData>> {
  const { data } = await client.get<ApiResponse<PromoCodeListData>>('/promo-codes', { params });
  return data;
}

export async function getPromoCode(id: number): Promise<ApiResponse<PromoCode>> {
  const { data } = await client.get<ApiResponse<PromoCode>>(`/promo-codes/${id}`);
  return data;
}
