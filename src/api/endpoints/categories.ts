import { client } from '../client';
import type { ApiResponse } from '../types';
import type { Category, CategoryListData } from '../types/catalog';

export async function getCategories(params?: { page?: number; per_page?: number; search?: string }): Promise<ApiResponse<CategoryListData>> {
  const { data } = await client.get<ApiResponse<CategoryListData>>('/categories', { params });
  return data;
}

export async function getCategory(id: number): Promise<ApiResponse<Category>> {
  const { data } = await client.get<ApiResponse<Category>>(`/categories/${id}`);
  return data;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<ApiResponse<Category>> {
  const { data } = await client.post<ApiResponse<Category>>('/categories', payload);
  return data;
}

export async function updateCategory(id: number, payload: UpdateCategoryPayload): Promise<ApiResponse<Category>> {
  const { data } = await client.put<ApiResponse<Category>>(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  const { data } = await client.delete<ApiResponse<null>>(`/categories/${id}`);
  return data;
}
