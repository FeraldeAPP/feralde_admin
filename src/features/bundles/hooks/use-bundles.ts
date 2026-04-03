import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBundles, getBundle, createBundle, updateBundle, deleteBundle } from '../api';
import type { UpdateBundlePayload } from '../api/bundles.api';

export function useBundles(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['bundles', params],
    queryFn: () => getBundles(params),
  });
}

export function useBundle(id: number) {
  return useQuery({
    queryKey: ['bundles', id],
    queryFn: () => getBundle(id),
    enabled: id > 0,
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBundle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useUpdateBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBundlePayload }) => updateBundle(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}

export function useDeleteBundle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBundle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
}
