import type { Pagination } from './common';

export type DistributorRank =
  | 'STARTER'
  | 'BRONZE'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND';

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';

export interface Distributor {
  id: number;
  user_id: number;
  distributor_code: string;
  rank: DistributorRank;
  referral_code: string | null;
  parent_distributor_id: number | null;
  assigned_city: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  suspended_at: string | null;
  total_network_sales: string;
  total_personal_sales: string;
  created_at: string;
  updated_at: string;
}

export interface DistributorListData {
  distributors: Distributor[];
  pagination: Pagination;
}

export interface NetworkReseller {
  id: number;
  user_id: number;
  reseller_code: string;
  referral_code: string | null;
  parent_distributor_id: number | null;
  city: string | null;
  approved_at: string | null;
  total_sales: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkResellersData {
  distributor_code: string;
  assigned_city: string | null;
  total: number;
  resellers: NetworkReseller[];
}

export interface Reseller {
  id: number;
  user_id: number;
  reseller_code: string;
  referral_code: string | null;
  parent_distributor_id: number | null;
  city: string | null;
  approved_at: string | null;
  total_sales: string;
  created_at: string;
  updated_at: string;
}

export interface ResellerListData {
  resellers: Reseller[];
  pagination: Pagination;
}

export interface Commission {
  id: number;
  distributor_id: number | null;
  reseller_id: number | null;
  order_id: number | null;
  commission_type: string;
  base_amount: string;
  rate: string;
  amount: string;
  status: CommissionStatus;
  approved_at: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommissionListData {
  commissions: Commission[];
  pagination: Pagination;
}
