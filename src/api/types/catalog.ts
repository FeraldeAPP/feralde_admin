import type { Pagination } from './common';

export type { Pagination };

// ---- Category ----
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryListData {
  categories: Category[];
  pagination: Pagination;
}

// ---- Bundle ----
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

// ---- PromoCode ----
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
