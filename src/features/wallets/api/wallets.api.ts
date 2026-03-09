import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { Wallet, WalletListData, Withdrawal, WithdrawalListData } from '../types';

export async function getWallets(params?: { page?: number; per_page?: number }): Promise<ApiResponse<WalletListData>> {
    const { data } = await client.get<ApiResponse<WalletListData>>('/wallets', { params });
    return data;
}

export async function getWallet(id: number): Promise<ApiResponse<Wallet>> {
    const { data } = await client.get<ApiResponse<Wallet>>(`/wallets/${id}`);
    return data;
}

export async function getWalletWithdrawals(
    walletId: number,
    params?: { page?: number; per_page?: number },
): Promise<ApiResponse<WithdrawalListData>> {
    const { data } = await client.get<ApiResponse<WithdrawalListData>>(`/wallets/${walletId}/withdrawals`, { params });
    return data;
}

export async function approveWithdrawal(walletId: number, withdrawalId: number): Promise<ApiResponse<Withdrawal>> {
    const { data } = await client.post<ApiResponse<Withdrawal>>(
        `/wallets/${walletId}/withdrawals/${withdrawalId}/approve`,
    );
    return data;
}

export async function rejectWithdrawal(walletId: number, withdrawalId: number): Promise<ApiResponse<Withdrawal>> {
    const { data } = await client.post<ApiResponse<Withdrawal>>(
        `/wallets/${walletId}/withdrawals/${withdrawalId}/reject`,
    );
    return data;
}
