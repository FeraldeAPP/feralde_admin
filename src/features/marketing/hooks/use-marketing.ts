import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMarketingAssets,
  getMyMarketingAssets,
  createMarketingAsset,
  updateMarketingAsset,
  deleteMarketingAsset,
  toggleMarketingAssetStatus,
} from '../api';
import type { MarketingFormValues } from '../types';

export function useMarketingAssets(page: number, enabled: boolean) {
  return useQuery({
    queryKey: ['marketing-assets', page],
    queryFn: () => getMarketingAssets({ page, per_page: 15 }),
    enabled,
  });
}

export function useMyMarketingAssets(page: number, enabled: boolean) {
  return useQuery({
    queryKey: ['marketing-assets', 'me', page],
    queryFn: () => getMyMarketingAssets({ page, per_page: 15 }),
    enabled,
  });
}

export function useCreateMarketingAsset(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: MarketingFormValues) => createMarketingAsset(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-assets'] });
      options?.onSuccess?.();
    },
  });
}

export function useUpdateMarketingAsset(id: number, options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: MarketingFormValues) => updateMarketingAsset(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-assets'] });
      options?.onSuccess?.();
    },
  });
}

export function useDeleteMarketingAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMarketingAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-assets'] });
    },
  });
}

export function useToggleMarketingAssetStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleMarketingAssetStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-assets'] });
    },
  });
}
