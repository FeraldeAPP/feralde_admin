import { useQuery } from '@tanstack/react-query';
import { getDistributors, getDistributor, getMyDistributorProfile, getMyOrders } from '../api';
import type { DistributorFilters } from '../types';

export function useDistributors(filters?: DistributorFilters) {
  return useQuery({
    queryKey: ['distributors', filters],
    queryFn: () => getDistributors(filters),
  });
}

export function useDistributor(id: number) {
  return useQuery({
    queryKey: ['distributors', id],
    queryFn: () => getDistributor(id),
    enabled: id > 0,
  });
}

export function useMyDistributorProfile() {
  return useQuery({
    queryKey: ['distributors', 'me'],
    queryFn: () => getMyDistributorProfile(),
  });
}

export function useMyOrders(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
}) {
    return useQuery({
        queryKey: ['distributor-orders', params],
        queryFn: () => getMyOrders(params),
    });
}
