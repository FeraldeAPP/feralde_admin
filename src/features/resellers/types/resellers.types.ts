import type { Pagination } from '@/lib/api/types';

export interface Reseller {
    id: number;
    user_id: number;
    reseller_code: string;
    referral_code: string | null;
    parent_distributor_id: number | null;
    city: string | null;
    approved_at: string | null;
    total_sales: string;
    created_at: string;
    updated_at: string;
}

export interface ResellerListData {
    resellers: Reseller[];
    pagination: Pagination;
}
