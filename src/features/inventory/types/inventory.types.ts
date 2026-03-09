import type { Pagination } from '@/lib/api/types';

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
