import { authClient as client } from '@/lib/api/auth-client';
import type { ApiResponse } from '@/lib/api/types';
import type { LoginPayload, User } from '../types';

export async function login(payload: LoginPayload): Promise<ApiResponse<User>> {
    const { data } = await client.post<ApiResponse<User>>('/auth/login', payload);
    return data;
}

export async function logout(): Promise<ApiResponse<null>> {
    const { data } = await client.post<ApiResponse<null>>('/auth/logout');
    return data;
}

export async function getMe(): Promise<ApiResponse<User>> {
    const { data } = await client.get<ApiResponse<User>>('/user');
    return data;
}
