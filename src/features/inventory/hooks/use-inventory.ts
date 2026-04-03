import { useQuery } from '@tanstack/react-query';
import { getInventory, getInventoryItem } from '../api';
import type { InventoryFilters } from '../types';

export function useInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: ['inventory', filters],
    queryFn: () => getInventory(filters),
  });
}

export function useInventoryItem(id: number) {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: () => getInventoryItem(id),
    enabled: id > 0,
  });
}
