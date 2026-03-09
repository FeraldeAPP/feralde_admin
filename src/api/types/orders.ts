import type { Pagination } from './common';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: number;
  order_number: string;
  customer_id: number | null;
  distributor_id: number | null;
  reseller_id: number | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  subtotal: string;
  shipping_fee: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  pricing_tier: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderListData {
  orders: Order[];
  pagination: Pagination;
}

export interface InventoryVariant {
  id: number;
  sku: string;
  name: string;
  product?: { id: number; name: string };
}

export interface InventoryWarehouse {
  id: number;
  name: string;
}

export interface InventoryItem {
  id: number;
  variant_id: number;
  warehouse_id: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_damaged: number;
  reorder_point: number;
  reorder_quantity: number;
  last_stocked_at: string | null;
  last_audited_at: string | null;
  variant?: InventoryVariant;
  warehouse?: InventoryWarehouse;
}

export interface InventoryListData {
  inventory: InventoryItem[];
  pagination: Pagination;
}
