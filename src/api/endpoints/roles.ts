import { client } from '../client';
import type { ApiResponse, RoleWithPermissions, CreateRolePayload } from '../types';

export async function getRoles(): Promise<ApiResponse<RoleWithPermissions[]>> {
  const { data } = await client.get<ApiResponse<RoleWithPermissions[]>>('/roles');
  return data;
}

export async function createRole(payload: CreateRolePayload): Promise<ApiResponse<RoleWithPermissions>> {
  const { data } = await client.post<ApiResponse<RoleWithPermissions>>('/roles', payload);
  return data;
}
