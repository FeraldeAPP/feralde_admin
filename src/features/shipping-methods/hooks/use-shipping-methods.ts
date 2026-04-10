import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shippingMethodsApi } from '../api/shipping-methods.api';
import type { CreateShippingMethodDto, UpdateShippingMethodDto } from '../types';

export const useShippingMethods = () => {
    return useQuery({
        queryKey: ['shipping-methods'],
        queryFn: shippingMethodsApi.getAll,
    });
};

export const useShippingMethod = (id: number) => {
    return useQuery({
        queryKey: ['shipping-methods', id],
        queryFn: () => shippingMethodsApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateShippingMethod = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CreateShippingMethodDto) => shippingMethodsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
        },
    });
};

export const useUpdateShippingMethod = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateShippingMethodDto }) => 
            shippingMethodsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
            queryClient.invalidateQueries({ queryKey: ['shipping-methods', variables.id] });
        },
    });
};

export const useDeleteShippingMethod = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => shippingMethodsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
        },
    });
};
