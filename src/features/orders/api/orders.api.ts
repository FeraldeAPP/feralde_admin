import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { Order, OrderListData, OrderStatus } from '../types';

export async function getOrders(params?: { page?: number; per_page?: number; status?: string }): Promise<ApiResponse<OrderListData>> {
    const { data } = await client.get<ApiResponse<OrderListData>>('/orders', { params });
    return data;
}

export async function getOrder(id: number): Promise<ApiResponse<Order>> {
    const { data } = await client.get<ApiResponse<Order>>(`/orders/${id}`);
    return data;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<ApiResponse<Order>> {
    const { data } = await client.put<ApiResponse<Order>>(`/orders/${id}`, { status });
    return data;
}
