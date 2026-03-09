import type { Pagination } from '@/lib/api/types';

export type PromoCodeType =
    | 'PERCENTAGE_DISCOUNT'
    | 'FIXED_DISCOUNT'
    | 'FREE_SHIPPING'
    | 'BUY_X_GET_Y'
    | 'BUNDLE_DEAL';

export interface PromoCode {
    id: number;
    code: string;
    description: string | null;
    type: PromoCodeType;
    value: string;
    min_order_amount: string | null;
    max_discount: string | null;
    usage_limit: number | null;
    usage_count: number;
    per_user_limit: number | null;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PromoCodeListData {
    promo_codes: PromoCode[];
    pagination: Pagination;
}
