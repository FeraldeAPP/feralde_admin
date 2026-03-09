import type { Pagination } from '@/lib/api/types';

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';

export interface Commission {
    id: number;
    distributor_id: number | null;
    reseller_id: number | null;
    order_id: number | null;
    commission_type: string;
    base_amount: string;
    rate: string;
    amount: string;
    status: CommissionStatus;
    approved_at: string | null;
    paid_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CommissionListData {
    commissions: Commission[];
    pagination: Pagination;
}
