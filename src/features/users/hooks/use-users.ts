import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getUser, createUser, updateUser, deleteUser, assignUserRoles } from '../api';
import type { UserFilters, CreateUserPayload, UpdateUserPayload, AssignRolesPayload } from '../types';

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters),
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
    enabled: id > 0,
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AssignRolesPayload }) =>
      assignUserRoles(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    assignRolesMutation,
  };
}
