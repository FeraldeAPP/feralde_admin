import type { Pagination } from '@/lib/api/types';

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
