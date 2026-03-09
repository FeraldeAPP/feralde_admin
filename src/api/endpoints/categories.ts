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
