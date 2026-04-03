import type { Pagination } from '@/lib/api/types';

export type PeriodStatus = 'OPEN' | 'CLOSED';
export type ExpenseStatus = 'Paid' | 'Approved' | 'Pending';

export interface AccountingPeriod {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: PeriodStatus;
    closed_by: string | null;
    closed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface AccountingPeriodListData {
    periods: AccountingPeriod[];
    pagination: Pagination;
}

export interface Expense {
    id: string;
    date: string;
    category: string;
    department: string;
    description: string;
    vendor: string;
    payment_method: string;
    amount: number;
    status: ExpenseStatus;
    approved_by: {
        name: string;
        avatar: string;
    };
}

export interface ExpenseStats {
    total_expenses: {
        amount: number;
        trend: number;
    };
    outstanding_payables: {
        amount: number;
        trend: number;
        percentage: number;
    };
    overdue_payables: {
        amount: number;
        trend: number;
        percentage: number;
    };
    recurring_expenses: {
        amount: number;
        trend: number;
        percentage: number;
    };
}

export interface ExpenseListData {
    expenses: Expense[];
    pagination: Pagination;
}

export interface ExpenseFilters {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
}
