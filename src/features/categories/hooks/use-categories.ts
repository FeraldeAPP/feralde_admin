import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../api/categories.api';
import type { UpdateCategoryPayload } from '../api/categories.api';

export function useCategories(params?: { page?: number; per_page?: number; search?: string }) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategory(id),
    enabled: id > 0,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) => updateCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
