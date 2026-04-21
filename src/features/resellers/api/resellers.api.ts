import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type {
    DistributorPublicProfile,
    Reseller,
    ResellerCityStat,
    ResellerFilters,
    ResellerListData,
    ResellerRegistrationData,
    ResellerRegistrationResult,
} from '../types';

export async function getResellers(params?: ResellerFilters): Promise<ApiResponse<ResellerListData>> {
    const { data } = await client.get<ApiResponse<ResellerListData>>('/resellers', { params });
    return data;
}

export async function getMyResellers(params?: ResellerFilters): Promise<ApiResponse<ResellerListData>> {
    const { data } = await client.get<ApiResponse<ResellerListData>>('/distributors/me/resellers', { params });
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

export async function getResellerCityStats(): Promise<ApiResponse<ResellerCityStat[]>> {
    const { data } = await client.get<ApiResponse<ResellerCityStat[]>>('/resellers/cities');
    return data;
}

export async function getDistributorPublicProfile(referralCode: string): Promise<ApiResponse<DistributorPublicProfile>> {
    const { data } = await client.get<ApiResponse<DistributorPublicProfile>>(`/register/distributor/${referralCode}`);
    return data;
}

export async function registerAsReseller(
    referralCode: string,
    payload: ResellerRegistrationData,
): Promise<ApiResponse<ResellerRegistrationResult>> {
    const { data } = await client.post<ApiResponse<ResellerRegistrationResult>>(
        `/register/reseller/${referralCode}`,
        payload,
    );
    return data;
}
