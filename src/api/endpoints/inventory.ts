import { client } from '../client';
import type { ApiResponse } from '../types';
import type { InventoryItem, InventoryListData } from '../types/orders';

export async function getInventory(params?: { page?: number; per_page?: number; warehouse_id?: number }): Promise<ApiResponse<InventoryListData>> {
  const { data } = await client.get<ApiResponse<InventoryListData>>('/inventory', { params });
  return data;
}

export async function getInventoryItem(id: number): Promise<ApiResponse<InventoryItem>> {
  const { data } = await client.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);
  return data;
}

export async function adjustInventory(payload: { variant_id: number; warehouse_id: number; quantity: number; type: 'INCREMENT' | 'DECREMENT' | 'SET'; reason?: string }): Promise<ApiResponse<InventoryItem>> {
  const { data } = await client.post<ApiResponse<InventoryItem>>('/inventory/adjust', payload);
  return data;
}
