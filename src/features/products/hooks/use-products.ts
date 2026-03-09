import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct } from '@/api/endpoints';
import type { ProductFilters } from '@/api/types';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProduct(id),
    enabled: id > 0,
  });
}
