import type { Pagination } from '@/lib/api/types';

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
