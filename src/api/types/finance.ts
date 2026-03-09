import type { Pagination } from './common';

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

export type PeriodStatus = 'OPEN' | 'CLOSED';

export interface AccountingPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: PeriodStatus;
  closed_by: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccountingPeriodListData {
  periods: AccountingPeriod[];
  pagination: Pagination;
}

export interface LeaderboardEntry {
  id: number;
  period: string;
  distributor_id: number | null;
  reseller_id: number | null;
  total_sales: string;
  total_orders: number;
  rank: number;
  badge: string | null;
}

export interface LeaderboardData {
  period: string;
  entries: LeaderboardEntry[];
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
