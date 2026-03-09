import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type {
    AdminUser,
    UserListData,
    CreateUserPayload,
    UpdateUserPayload,
    AssignRolesPayload,
} from '../types';

export async function getUsers(params?: {
    search?: string;
    per_page?: number;
    page?: number;
}): Promise<ApiResponse<UserListData>> {
    const { data } = await client.get<ApiResponse<UserListData>>('/users', { params });
    return data;
}

export async function getUser(id: number): Promise<ApiResponse<AdminUser>> {
    const { data } = await client.get<ApiResponse<AdminUser>>(`/users/${id}`);
    return data;
}

export async function createUser(payload: CreateUserPayload): Promise<ApiResponse<AdminUser>> {
    const { data } = await client.post<ApiResponse<AdminUser>>('/users', payload);
    return data;
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<ApiResponse<AdminUser>> {
    const { data } = await client.put<ApiResponse<AdminUser>>(`/users/${id}`, payload);
    return data;
}

export async function deleteUser(id: number): Promise<ApiResponse<null>> {
    const { data } = await client.delete<ApiResponse<null>>(`/users/${id}`);
    return data;
}

export async function assignUserRoles(id: number, payload: AssignRolesPayload): Promise<ApiResponse<AdminUser>> {
    const { data } = await client.post<ApiResponse<AdminUser>>(`/users/${id}/roles`, payload);
    return data;
}
