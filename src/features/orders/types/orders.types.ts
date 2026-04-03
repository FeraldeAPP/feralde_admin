import type { Pagination } from '@/lib/api/types';

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
}

export interface OrderListData {
    orders: Order[];
    pagination: Pagination;
}
