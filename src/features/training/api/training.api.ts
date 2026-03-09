import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { TrainingModule, TrainingListData } from '../types';

export async function getTrainingModules(params?: { page?: number; per_page?: number }): Promise<ApiResponse<TrainingListData>> {
    const { data } = await client.get<ApiResponse<TrainingListData>>('/training', { params });
    return data;
}

export async function getTrainingModule(id: number): Promise<ApiResponse<TrainingModule>> {
    const { data } = await client.get<ApiResponse<TrainingModule>>(`/training/${id}`);
    return data;
}

export async function createTrainingModule(payload: {
    title: string;
    description?: string | null;
    sort_order?: number;
    is_published?: boolean;
}): Promise<ApiResponse<TrainingModule>> {
    const { data } = await client.post<ApiResponse<TrainingModule>>('/training', payload);
    return data;
}

export async function updateTrainingModule(
    id: number,
    payload: {
        title?: string;
        description?: string | null;
        sort_order?: number;
        is_published?: boolean;
    },
): Promise<ApiResponse<TrainingModule>> {
    const { data } = await client.put<ApiResponse<TrainingModule>>(`/training/${id}`, payload);
    return data;
}

export async function deleteTrainingModule(id: number): Promise<ApiResponse<null>> {
    const { data } = await client.delete<ApiResponse<null>>(`/training/${id}`);
    return data;
}

export async function publishTrainingModule(id: number): Promise<ApiResponse<TrainingModule>> {
    const { data } = await client.post<ApiResponse<TrainingModule>>(`/training/${id}/publish`);
    return data;
}
