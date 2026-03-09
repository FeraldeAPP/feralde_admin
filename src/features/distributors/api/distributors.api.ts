import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { Distributor, DistributorListData, NetworkResellersData } from '../types';

export async function getDistributors(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    rank?: string;
    status?: string;
    city?: string;
}): Promise<ApiResponse<DistributorListData>> {
    const { data } = await client.get<ApiResponse<DistributorListData>>('/distributors', { params });
    return data;
}

export async function getDistributor(id: number): Promise<ApiResponse<Distributor>> {
    const { data } = await client.get<ApiResponse<Distributor>>(`/distributors/${id}`);
    return data;
}

export async function approveDistributor(id: number): Promise<ApiResponse<Distributor>> {
    const { data } = await client.post<ApiResponse<Distributor>>(`/distributors/${id}/approve`);
    return data;
}

export async function rejectDistributor(id: number, reason?: string): Promise<ApiResponse<Distributor>> {
    const { data } = await client.post<ApiResponse<Distributor>>(`/distributors/${id}/reject`, { reason });
    return data;
}

export async function suspendDistributor(id: number, reason?: string): Promise<ApiResponse<Distributor>> {
    const { data } = await client.post<ApiResponse<Distributor>>(`/distributors/${id}/suspend`, { reason });
    return data;
}

export async function unsuspendDistributor(id: number): Promise<ApiResponse<Distributor>> {
    const { data } = await client.post<ApiResponse<Distributor>>(`/distributors/${id}/unsuspend`);
    return data;
}

export async function assignDistributorCity(id: number, city: string): Promise<ApiResponse<Distributor>> {
    const { data } = await client.post<ApiResponse<Distributor>>(`/distributors/${id}/city`, { city });
    return data;
}

export async function unassignDistributorCity(id: number): Promise<ApiResponse<Distributor>> {
    const { data } = await client.delete<ApiResponse<Distributor>>(`/distributors/${id}/city`);
    return data;
}

export async function getNetworkResellers(id: number): Promise<ApiResponse<NetworkResellersData>> {
    const { data } = await client.get<ApiResponse<NetworkResellersData>>(`/distributors/${id}/network-resellers`);
    return data;
}

export async function getCityDistributor(city: string): Promise<ApiResponse<Distributor | null>> {
    const { data } = await client.get<ApiResponse<Distributor | null>>('/distributors/city', { params: { city } });
    return data;
}
