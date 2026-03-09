import { client } from '../client';
import type { ApiResponse } from '../types';
import type { MarketingAsset, AssetListData, Announcement, AnnouncementListData } from '../types/content';

export async function getMarketingAssets(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AssetListData>> {
  const { data } = await client.get<ApiResponse<AssetListData>>('/marketing/assets', { params });
  return data;
}

export async function getAnnouncements(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AnnouncementListData>> {
  const { data } = await client.get<ApiResponse<AnnouncementListData>>('/marketing/announcements', { params });
  return data;
}

export async function getMarketingAsset(id: number): Promise<ApiResponse<MarketingAsset>> {
  const { data } = await client.get<ApiResponse<MarketingAsset>>(`/marketing/assets/${id}`);
  return data;
}

export async function getAnnouncement(id: number): Promise<ApiResponse<Announcement>> {
  const { data } = await client.get<ApiResponse<Announcement>>(`/marketing/announcements/${id}`);
  return data;
}
