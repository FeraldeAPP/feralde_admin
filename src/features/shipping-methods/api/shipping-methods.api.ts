import { client } from '@/lib/api/client';
import type { ShippingMethod, CreateShippingMethodDto, UpdateShippingMethodDto } from '../types';

export const shippingMethodsApi = {
    getAll: async (): Promise<ShippingMethod[]> => {
        const response = await client.get<ShippingMethod[]>('/shipping-methods');
        return response.data;
    },
    
    getById: async (id: number): Promise<ShippingMethod> => {
        const response = await client.get<ShippingMethod>(`/shipping-methods/${id}`);
        return response.data;
    },
    
    create: async (data: CreateShippingMethodDto): Promise<ShippingMethod> => {
        const response = await client.post<ShippingMethod>('/shipping-methods', data);
        return response.data;
    },
    
    update: async (id: number, data: UpdateShippingMethodDto): Promise<ShippingMethod> => {
        const response = await client.put<ShippingMethod>(`/shipping-methods/${id}`, data);
        return response.data;
    },
    
    delete: async (id: number): Promise<void> => {
        await client.delete(`/shipping-methods/${id}`);
    }
};
