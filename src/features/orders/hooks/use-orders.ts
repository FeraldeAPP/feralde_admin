import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrder, updateOrderStatus } from '../api/orders.api';
import type { OrderStatus } from '../types';

export function useOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    order_type?: 'shop' | 'distributor';
    search?: string;
}) {
    return useQuery({
        queryKey: ['orders', params],
        queryFn: () => getOrders(params),
    });
}

export function useOrder(id: number) {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => getOrder(id),
        enabled: id > 0,
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
}
