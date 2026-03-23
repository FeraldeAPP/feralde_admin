import type { Pagination } from '@/lib/api/types';

export interface Reseller {
    id: number;
    user_id: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
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

export interface DistributorPublicProfile {
    distributor_code: string;
    referral_code: string;
    assigned_city: string | null;
    rank: string;
}

export interface ResellerRegistrationData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
}

export interface ResellerRegistrationResult {
    reseller_code: string;
}

export interface ResellerCityStat {
    city: string;
    total: number;
}
