import type { Pagination } from './common';

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

export type AssetType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'PDF';

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
