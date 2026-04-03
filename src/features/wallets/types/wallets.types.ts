import type { Pagination } from '@/lib/api/types';

export interface Wallet {
    id: number;
    distributor_id: number | null;
    reseller_id: number | null;
    balance: string;
    pending_balance: string;
    lifetime_earned: string;
    lifetime_withdrawn: string;
    status: 'ACTIVE' | 'SUSPENDED';
    owner?: {
        name: string;
        avatar: string;
        type: 'Distributor' | 'Reseller';
    };
    last_transaction?: string;
    created_at: string;
    updated_at: string;
}

export interface WalletListData {
    wallets: Wallet[];
    pagination: Pagination;
}

export interface WalletStats {
    total_platform_balance: {
        amount: number;
        trend: number;
    };
    total_pending: {
        amount: number;
        trend: number;
        percentage: number;
    };
    average_balance: {
        amount: number;
        trend: number;
        percentage: number;
    };
    active_wallets: {
        count: number;
        trend: number;
        percentage: number;
    };
}

export interface WalletFilters {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
}

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
// ... (Withdrawal types remain as they were)
export interface Withdrawal {
    id: number;
    wallet_id: number;
    amount: string;
    status: WithdrawalStatus;
    notes: string | null;
    processed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface WithdrawalListData {
    withdrawals: Withdrawal[];
    pagination: Pagination;
}
