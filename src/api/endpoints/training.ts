import { client } from '../client';
import type { ApiResponse } from '../types';
import type { TrainingModule, TrainingListData } from '../types/content';

export async function getTrainingModules(params?: { page?: number; per_page?: number }): Promise<ApiResponse<TrainingListData>> {
  const { data } = await client.get<ApiResponse<TrainingListData>>('/training', { params });
  return data;
}

export async function getTrainingModule(id: number): Promise<ApiResponse<TrainingModule>> {
  const { data } = await client.get<ApiResponse<TrainingModule>>(`/training/${id}`);
  return data;
}
