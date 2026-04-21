import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTrainingModules,
  getMyTrainingModules,
  createTrainingModule,
  updateTrainingModule,
  deleteTrainingModule,
  publishTrainingModule,
} from '../api';
import type { TrainingFormValues } from '../types';

export function useTrainingModules(page: number) {
  return useQuery({
    queryKey: ['training', page],
    queryFn: () => getTrainingModules({ page, per_page: 15 }),
  });
}

export function useMyTrainingModules(page: number) {
  return useQuery({
    queryKey: ['training', 'me', page],
    queryFn: () => getMyTrainingModules({ page, per_page: 15 }),
  });
}

export function useCreateTraining(callbacks?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TrainingFormValues) =>
      createTrainingModule({
        title: payload.title,
        description: payload.description ?? null,
        sort_order: payload.sort_order,
        is_published: payload.is_published,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
      callbacks?.onSuccess?.();
    },
  });
}

export function useUpdateTraining(id: number, callbacks?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TrainingFormValues) =>
      updateTrainingModule(id, {
        title: payload.title,
        description: payload.description ?? null,
        sort_order: payload.sort_order,
        is_published: payload.is_published,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
      callbacks?.onSuccess?.();
    },
  });
}

export function useDeleteTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTrainingModule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
    },
  });
}

export function usePublishTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishTrainingModule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
    },
  });
}

export function useUnpublishTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => updateTrainingModule(id, { is_published: false }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
    },
  });
}
