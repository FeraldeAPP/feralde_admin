import { client } from '../client';
import type { ApiResponse } from '../types';
import type { Order, OrderListData } from '../types/orders';

export async function getOrders(params?: { page?: number; per_page?: number; status?: string }): Promise<ApiResponse<OrderListData>> {
  const { data } = await client.get<ApiResponse<OrderListData>>('/orders', { params });
  return data;
}

export async function getOrder(id: number): Promise<ApiResponse<Order>> {
  const { data } = await client.get<ApiResponse<Order>>(`/orders/${id}`);
  return data;
}
