import { z } from 'zod';

export const bundleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable().optional(),
    type: z.enum(['FIXED', 'DYNAMIC', 'GIFT_SET'] as const),
    image_url: z.string().nullable().optional(),
    retail_price: z.number().min(0, 'Retail price must be 0 or more'),
    distributor_price: z.number().min(0, 'Distributor price must be 0 or more'),
    is_active: z.boolean().optional(),
    starts_at: z.string().nullable().optional(),
    ends_at: z.string().nullable().optional(),
});

export type BundleFormValues = z.infer<typeof bundleSchema>;
