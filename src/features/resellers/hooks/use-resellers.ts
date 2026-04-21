import { useQuery } from '@tanstack/react-query';
import { getResellers, getReseller, getMyResellers } from '../api';
import type { ResellerFilters } from '../types';

export function useResellers(filters?: ResellerFilters) {
  return useQuery({
    queryKey: ['resellers', filters],
    queryFn: () => getResellers(filters),
  });
}

export function useMyResellers(filters?: ResellerFilters) {
  return useQuery({
    queryKey: ['resellers', 'me', filters],
    queryFn: () => getMyResellers(filters),
  });
}

export function useReseller(id: number) {
  return useQuery({
    queryKey: ['resellers', id],
    queryFn: () => getReseller(id),
    enabled: id > 0,
  });
}
