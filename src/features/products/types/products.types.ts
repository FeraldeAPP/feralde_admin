export type PricingTier = 'RETAIL' | 'DISTRIBUTOR' | 'RESELLER' | 'WHOLESALE';

export interface VariantPricing {
    id: number;
    tier: PricingTier;
    price: string;
    is_active: boolean;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    sku: string;
    name: string;
    size: string | null;
    concentration: string | null;
    barcode: string | null;
    weight_grams: number | null;
    is_active: boolean;
    sort_order: number;
    pricing?: VariantPricing[];
    created_at: string;
    updated_at: string;
}

export interface ProductMedia {
    id: number;
    url: string;
    type: 'image' | 'video';
    is_primary: boolean;
    alt_text: string | null;
    sort_order: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    description: string | null;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    category_id: number | null;
    scent_notes: string[] | null;
    ingredients: string | null;
    meta_title: string | null;
    meta_description: string | null;
    is_active: boolean;
    is_featured: boolean;
    is_best_seller: boolean;
    is_new_arrival: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    category?: Category;
    variants?: ProductVariant[];
    media?: ProductMedia[];
}

export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ProductListData {
    products: Product[];
    pagination: Pagination;
}

export interface ProductFilters {
    search?: string;
    is_active?: boolean;
    category_id?: number;
    per_page?: number;
    page?: number;
    with_trashed?: boolean;
}

export interface ProductPayload {
    sku: string;
    name: string;
    slug?: string;
    description?: string | null;
    short_description?: string | null;
    category_id?: number | null;
    scent_notes?: string[] | null;
    ingredients?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    is_active?: boolean;
    is_featured?: boolean;
    is_best_seller?: boolean;
    is_new_arrival?: boolean;
}

export interface UploadResult {
    url: string;
    path: string;
    disk: string;
    filename: string;
    original: string;
    mime_type: string;
    size_bytes: number;
}

export interface AddMediaPayload {
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'PDF';
    alt_text?: string | null;
    sort_order?: number;
    is_primary?: boolean;
}
