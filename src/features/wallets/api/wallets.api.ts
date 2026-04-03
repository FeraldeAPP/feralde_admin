import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { 
    Wallet, 
    WalletListData, 
    Withdrawal, 
    WithdrawalListData, 
    WalletStats, 
    WalletFilters 
} from '../types';

export async function getWallets(params?: WalletFilters): Promise<ApiResponse<WalletListData>> {
    console.log('Fetching wallets with params:', params);
    
    // try {
    //     const { data } = await client.get<ApiResponse<WalletListData>>('/wallets', { params });
    //     return data;
    // } catch (e) {
    //     // Mock Fallback
    // }

    const mockWallets: Wallet[] = [
        {
            id: 1,
            distributor_id: 101,
            reseller_id: null,
            balance: '83950.00',
            pending_balance: '13700.00',
            lifetime_earned: '124000.00',
            lifetime_withdrawn: '40050.00',
            status: 'ACTIVE',
            owner: { name: 'Juan Dela Cruz', avatar: '/user.png', type: 'Distributor' },
            last_transaction: 'Few seconds ago',
            created_at: '2025-01-01',
            updated_at: '2025-01-16'
        },
        {
            id: 2,
            distributor_id: null,
            reseller_id: 502,
            balance: '12800.00',
            pending_balance: '5250.00',
            lifetime_earned: '35000.00',
            lifetime_withdrawn: '22200.00',
            status: 'ACTIVE',
            owner: { name: 'Maria Clara', avatar: '/user.png', type: 'Reseller' },
            last_transaction: '2 mins ago',
            created_at: '2025-01-05',
            updated_at: '2025-01-15'
        },
        {
            id: 3,
            distributor_id: 103,
            reseller_id: null,
            balance: '4200.00',
            pending_balance: '0.00',
            lifetime_earned: '8500.00',
            lifetime_withdrawn: '4300.00',
            status: 'SUSPENDED',
            owner: { name: 'Pedro Santos', avatar: '/user.png', type: 'Distributor' },
            last_transaction: '1 hour ago',
            created_at: '2025-01-10',
            updated_at: '2025-01-14'
        },
        {
            id: 4,
            distributor_id: null,
            reseller_id: 504,
            balance: '15000.00',
            pending_balance: '1500.00',
            lifetime_earned: '22000.00',
            lifetime_withdrawn: '7000.00',
            status: 'ACTIVE',
            owner: { name: 'Liza Reyes', avatar: '/user.png', type: 'Reseller' },
            last_transaction: 'Yesterday',
            created_at: '2025-01-12',
            updated_at: '2025-01-16'
        }
    ];

    return {
        success: true,
        message: 'Wallets fetched successfully',
        data: {
            wallets: mockWallets,
            pagination: {
                total: 4,
                per_page: 15,
                current_page: 1,
                last_page: 1
            }
        }
    };
}

export async function getWalletStats(): Promise<ApiResponse<WalletStats>> {
    return {
        success: true,
        message: 'Stats fetched successfully',
        data: {
            total_platform_balance: { amount: 83950, trend: 2.5 },
            total_pending: { amount: 13700, trend: 2.5, percentage: 65 },
            average_balance: { amount: 4200, trend: 2.5, percentage: 65 },
            active_wallets: { count: 248, trend: 2.5, percentage: 65 }
        }
    };
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
