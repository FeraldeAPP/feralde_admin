import { client } from '../client';
import type { ApiResponse, Permission } from '../types';

export async function getPermissions(): Promise<ApiResponse<Permission[]>> {
  const { data } = await client.get<ApiResponse<Permission[]>>('/permissions');
  return data;
}
