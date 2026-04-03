import type { Pagination } from '@/lib/api/types';
import { z } from 'zod';

export interface Announcement {
    id: number;
    title: string;
    body: string;
    image_url: string | null;
    target_roles: string[] | null;
    is_pinned: boolean;
    is_published: boolean;
    published_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface AnnouncementListData {
    announcements: Announcement[];
    pagination: Pagination;
}

export const announcementSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
    image_url: z.string().nullable().optional(),
    target_roles: z.array(z.string()).nullable().optional(),
    is_pinned: z.boolean().optional(),
    is_published: z.boolean().optional(),
    expires_at: z.string().nullable().optional(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;

export type AnnouncementModalMode = null | 'create' | { edit: Announcement };
