import { useQuery } from '@tanstack/react-query';
import { getDistributors, getDistributor } from '../api';
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
