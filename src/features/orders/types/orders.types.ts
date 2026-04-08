import type { Pagination } from '@/lib/api/types';
import type { ProductVariant } from '@/features/products/types/products.types';

export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PACKED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderDistributor {
    id: number;
    distributor_code: string;
    rank: string;
    assigned_city: string | null;
    user_id: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_variant_id: number;
    product_name: string;
    variant_name: string | null;
    sku: string | null;
    quantity: number;
    unit_price: string;
    subtotal: string;
    total_price?: string;
    tax_amount: string;
    discount_amount: string;
    total_amount: string;
    image_url?: string | null;
    variant?: ProductVariant;
}


export interface OrderAddress {
    id: number;
    user_id: number | null;
    first_name: string;
    last_name: string;
    phone: string;
    barangay: string;
    city: string;
    province: string;
    region: string;
    details: string;
    postal_code: string | null;
    country: string;
    created_at: string;
    is_default: boolean;
}

export interface Order {
    id: number;
    order_number: string;
    customer_id: string | null;
    distributor_id: number | null;
    reseller_id: number | null;
    source: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method: string | null;
    guest_email: string | null;
    payment_proof_url?: string | null;
    subtotal: string;
    shipping_fee: string;
    discount_amount: string;
    tax_amount: string;
    total_amount: string;
    pricing_tier: string | null;
    internal_notes: string | null;
    created_at: string;
    updated_at: string;
    // Eager-loaded relations
    distributor?: OrderDistributor | null;
    items?: OrderItem[];
    customer_name?: string | null;
    billing_address_id?: number | null;
    shipping_address_id?: number | null;
    billing_address?: OrderAddress | null;
    shipping_address?: OrderAddress | null;
    shipping_method?: string | null;
    tracking_number?: string | null;
}

export interface OrderListData {
    orders: Order[];
    pagination: Pagination;
}

export interface OrderHistory {
    id: number;
    order_id: number;
    user_id: string | null;
    user_name: string | null;
    action: string;
    description: string;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}
