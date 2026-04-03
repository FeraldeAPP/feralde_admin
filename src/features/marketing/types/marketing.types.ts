import type { Pagination } from '@/lib/api/types';
import { z } from 'zod';

export interface MarketingAsset {
    id: number;
    title: string;
    type: AssetType;
    url: string;
    thumbnail_url: string | null;
    description: string | null;
    tags: string[] | null;
    is_active: boolean;
    uploaded_by: string | null;
}

export interface AssetListData {
    assets: MarketingAsset[];
    pagination: Pagination;
}

export type AssetType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'PDF';

export const marketingSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().nullable().optional(),
    type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'PDF']).optional(),
    is_active: z.boolean().optional(),
});

export type MarketingFormValues = z.infer<typeof marketingSchema>;

export type MarketingModalState = null | 'create' | MarketingAsset;

export interface AssetFormProps {
    initial: MarketingAsset | null;
    onClose: () => void;
    onSaved: () => void;
}
