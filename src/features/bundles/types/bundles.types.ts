import type { Pagination } from '@/lib/api/types';

export type BundleType = 'FIXED' | 'DYNAMIC' | 'GIFT_SET';

export interface BundleItem {
    id: number;
    bundle_id: number;
    product_id: number;
    variant_id: number | null;
    quantity: number;
}

export interface Bundle {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    type: BundleType;
    image_url: string | null;
    retail_price: string;
    distributor_price: string;
    is_active: boolean;
    starts_at: string | null;
    ends_at: string | null;
    created_at: string;
    updated_at: string;
    items?: BundleItem[];
}

export interface BundleListData {
    bundles: Bundle[];
    pagination: Pagination;
}
