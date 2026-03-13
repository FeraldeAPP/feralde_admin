import { authClient as client } from '@/lib/api/auth-client';
import type { ApiResponse } from '@/lib/api/types';
import type { RoleWithPermissions, CreateRolePayload, Permission } from '../types';

export async function getRoles(): Promise<ApiResponse<RoleWithPermissions[]>> {
    const { data } = await client.get<ApiResponse<RoleWithPermissions[]>>('/roles');
    return data;
}

export async function createRole(payload: CreateRolePayload): Promise<ApiResponse<RoleWithPermissions>> {
    const { data } = await client.post<ApiResponse<RoleWithPermissions>>('/roles', payload);
    return data;
}

export async function getPermissions(): Promise<ApiResponse<Permission[]>> {
    const { data } = await client.get<ApiResponse<Permission[]>>('/permissions');
    return data;
}
