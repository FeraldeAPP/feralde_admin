import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAnnouncements,
  getMyAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
} from '../api';
import type { AnnouncementFormValues } from '../types';

export function useAnnouncements(params?: { page?: number; per_page?: number; search?: string }, enabled: boolean = true) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => getAnnouncements(params),
    enabled,
  });
}

export function useMyAnnouncements(params?: { page?: number; per_page?: number; search?: string }, enabled: boolean = true) {
  return useQuery({
    queryKey: ['announcements', 'me', params],
    queryFn: () => getMyAnnouncements(params),
    enabled,
  });
}

export function useCreateAnnouncement(callbacks?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
      callbacks?.onSuccess?.();
    },
  });
}

export function useUpdateAnnouncement(id: number, callbacks?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AnnouncementFormValues>) => updateAnnouncement(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
      callbacks?.onSuccess?.();
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function usePublishAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useUnpublishAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => updateAnnouncement(id, { is_published: false }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}
