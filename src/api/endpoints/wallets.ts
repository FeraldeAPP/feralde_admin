import { client } from '../client';
import type { ApiResponse } from '../types';
import type { Wallet, WalletListData } from '../types/finance';

export async function getWallets(params?: { page?: number; per_page?: number }): Promise<ApiResponse<WalletListData>> {
  const { data } = await client.get<ApiResponse<WalletListData>>('/wallets', { params });
  return data;
}

export async function getWallet(id: number): Promise<ApiResponse<Wallet>> {
  const { data } = await client.get<ApiResponse<Wallet>>(`/wallets/${id}`);
  return data;
}
