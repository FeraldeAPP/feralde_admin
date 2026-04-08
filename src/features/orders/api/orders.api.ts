import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { Order, OrderListData, OrderStatus } from '../types';

export async function getOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    order_type?: 'shop' | 'distributor';
    search?: string;
}): Promise<ApiResponse<OrderListData>> {
    const { data } = await client.get<ApiResponse<OrderListData>>('/orders', { params });
    return data;
}

export async function getOrder(id: number): Promise<ApiResponse<Order>> {
    const { data } = await client.get<ApiResponse<Order>>(`/orders/${id}`);
    return data;
}

export async function updateOrderStatus(
    id: number,
    status: OrderStatus,
    shipping_method?: string,
    tracking_number?: string
): Promise<ApiResponse<Order>> {
    const { data } = await client.put<ApiResponse<Order>>(`/orders/${id}`, {
        status,
        shipping_method,
        tracking_number,
    });
    return data;
}

export async function markOrderAsPaid(id: number): Promise<ApiResponse<Order>> {
    const { data } = await client.post<ApiResponse<Order>>(`/orders/${id}/payments/paid`);
    return data;
}

export async function getOrderHistory(id: number): Promise<ApiResponse<any[]>> {
    const { data } = await client.get<ApiResponse<any[]>>(`/orders/${id}/history`);
    return data;
}
