import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable().optional(),
    parent_id: z.number().nullable().optional(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
