import type { Pagination } from '@/lib/api/types';

export interface Wallet {
    id: number;
    distributor_id: number | null;
    reseller_id: number | null;
    balance: string;
    pending_balance: string;
    lifetime_earned: string;
    lifetime_withdrawn: string;
    created_at: string;
    updated_at: string;
}

export interface WalletListData {
    wallets: Wallet[];
    pagination: Pagination;
}

export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
