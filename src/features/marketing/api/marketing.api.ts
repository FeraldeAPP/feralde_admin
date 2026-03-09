import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { MarketingAsset, AssetListData, Announcement, AnnouncementListData } from '../types';

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

export async function createAnnouncement(payload: {
    title: string;
    body: string;
    image_url?: string | null;
    target_roles?: string[] | null;
    is_pinned?: boolean;
    expires_at?: string | null;
}): Promise<ApiResponse<Announcement>> {
    const { data } = await client.post<ApiResponse<Announcement>>('/marketing/announcements', payload);
    return data;
}

export async function updateAnnouncement(
    id: number,
    payload: Partial<{
        title: string;
        body: string;
        image_url: string | null;
        target_roles: string[] | null;
        is_pinned: boolean;
        expires_at: string | null;
    }>,
): Promise<ApiResponse<Announcement>> {
    const { data } = await client.put<ApiResponse<Announcement>>(`/marketing/announcements/${id}`, payload);
    return data;
}

export async function deleteAnnouncement(id: number): Promise<ApiResponse<null>> {
    const { data } = await client.delete<ApiResponse<null>>(`/marketing/announcements/${id}`);
    return data;
}

export async function publishAnnouncement(id: number): Promise<ApiResponse<Announcement>> {
    const { data } = await client.post<ApiResponse<Announcement>>(`/marketing/announcements/${id}/publish`);
    return data;
}
