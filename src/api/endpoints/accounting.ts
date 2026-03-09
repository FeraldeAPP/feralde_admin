import { client } from '../client';
import type { ApiResponse } from '../types';
import type { AccountingPeriod, AccountingPeriodListData } from '../types/finance';

export async function getAccountingPeriods(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AccountingPeriodListData>> {
  const { data } = await client.get<ApiResponse<AccountingPeriodListData>>('/accounting/periods', { params });
  return data;
}

export async function getAccountingPeriod(id: number): Promise<ApiResponse<AccountingPeriod>> {
  const { data } = await client.get<ApiResponse<AccountingPeriod>>(`/accounting/periods/${id}`);
  return data;
}
