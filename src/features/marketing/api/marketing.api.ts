import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { MarketingAsset, AssetListData, MarketingFormValues } from '../types';

export async function getMarketingAssets(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AssetListData>> {
    const { data } = await client.get<ApiResponse<AssetListData>>('/marketing/assets', { params });
    return data;
}

export async function getMyMarketingAssets(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AssetListData>> {
    const { data } = await client.get<ApiResponse<AssetListData>>('/distributors/me/marketing-assets', { params });
    return data;
}

export async function getMarketingAsset(id: number): Promise<ApiResponse<MarketingAsset>> {
    const { data } = await client.get<ApiResponse<MarketingAsset>>(`/marketing/assets/${id}`);
    return data;
}

export async function createMarketingAsset(payload: MarketingFormValues): Promise<ApiResponse<MarketingAsset>> {
    const { data } = await client.post<ApiResponse<MarketingAsset>>('/marketing/assets', payload);
    return data;
}

export async function updateMarketingAsset(id: number, payload: MarketingFormValues): Promise<ApiResponse<MarketingAsset>> {
    const { data } = await client.patch<ApiResponse<MarketingAsset>>(`/marketing/assets/${id}`, payload);
    return data;
}

export async function deleteMarketingAsset(id: number): Promise<ApiResponse<void>> {
    const { data } = await client.delete<ApiResponse<void>>(`/marketing/assets/${id}`);
    return data;
}

export async function toggleMarketingAssetStatus(id: number): Promise<ApiResponse<MarketingAsset>> {
    const { data } = await client.post<ApiResponse<MarketingAsset>>(`/marketing/assets/${id}/toggle-status`);
    return data;
}
