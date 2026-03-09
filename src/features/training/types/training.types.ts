import type { Pagination } from '@/lib/api/types';

export interface TrainingModule {
    id: number;
    title: string;
    description: string | null;
    is_published: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface TrainingListData {
    modules: TrainingModule[];
    pagination: Pagination;
}
