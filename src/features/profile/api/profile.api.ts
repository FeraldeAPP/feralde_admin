import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { ChangePasswordPayload, ResetPasswordPayload } from '../types';

export async function changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<null>> {
    const { data } = await client.post<ApiResponse<null>>('/change-password', payload);
    return data;
}

export async function resendVerificationEmail(): Promise<ApiResponse<null>> {
    const { data } = await client.post<ApiResponse<null>>('/resend-verification-email');
    return data;
}

export async function verifyEmailByLink(link: string): Promise<ApiResponse<null>> {
    const { data } = await client.get<ApiResponse<null>>(link);
    return data;
}

export async function resetPasswordWithToken(payload: ResetPasswordPayload): Promise<ApiResponse<null>> {
    const { data } = await client.post<ApiResponse<null>>('/auth/reset-password', payload);
    return data;
}
