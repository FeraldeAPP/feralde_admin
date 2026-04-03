import type { Pagination } from '@/lib/api/types';
import { z } from 'zod';

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

export const trainingSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().nullable().optional(),
    sort_order: z.number().int().min(0).optional(),
    is_published: z.boolean().optional(),
});

export type TrainingFormValues = z.infer<typeof trainingSchema>;

export type TrainingModalState = null | 'create' | TrainingModule;

export interface ModuleFormProps {
    initial: TrainingModule | null;
    onClose: () => void;
    onSaved: () => void;
}
