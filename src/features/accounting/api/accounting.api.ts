import { client } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { 
    AccountingPeriod, 
    AccountingPeriodListData, 
    ExpenseListData, 
    ExpenseStats, 
    ExpenseFilters 
} from '../types';

export async function getAccountingPeriods(params?: { page?: number; per_page?: number }): Promise<ApiResponse<AccountingPeriodListData>> {
    const { data } = await client.get<ApiResponse<AccountingPeriodListData>>('/accounting/periods', { params });
    return data;
}

export async function getAccountingPeriod(id: number): Promise<ApiResponse<AccountingPeriod>> {
    const { data } = await client.get<ApiResponse<AccountingPeriod>>(`/accounting/periods/${id}`);
    return data;
}

export async function getExpenses(params?: ExpenseFilters): Promise<ApiResponse<ExpenseListData>> {
    console.log('Fetching expenses with filters:', params);
    // try {
    //     const { data } = await client.get<ApiResponse<ExpenseListData>>('/accounting/expenses', { params });
    //     return data;
    // } catch (e) {
    //     // Fallback to mock for UI development
    // }

    // Mock data matching Figma design
    const mockExpenses: any[] = [
        {
            id: 'EXP-2026-001',
            date: 'Feb 01, 2026',
            category: 'Raw Materials',
            department: 'Production',
            description: 'Fragrance oils batch',
            vendor: 'Meralco',
            payment_method: 'Bank Transfer',
            amount: 18450,
            status: 'Paid',
            approved_by: { name: 'Juan Del...', avatar: '/user.png' }
        },
        {
            id: 'EXP-2026-002',
            date: 'Feb 15, 2026',
            category: 'Packaging',
            department: 'Production',
            description: '500 glass perfume bottles',
            vendor: 'Office Depot',
            payment_method: 'Cash',
            amount: 5250,
            status: 'Approved',
            approved_by: { name: 'Maria Cl...', avatar: '/user.png' }
        },
        {
            id: 'EXP-2026-003',
            date: 'Mar 01, 2026',
            category: 'Marketing',
            department: 'Marketing',
            description: 'Social media ads campaign',
            vendor: 'Airline Co.',
            payment_method: 'Credit Card',
            amount: 12800,
            status: 'Paid',
            approved_by: { name: 'Pedro S...', avatar: '/user.png' }
        },
        {
            id: 'EXP-2026-004',
            date: 'Mar 05, 2026',
            category: 'Utilities',
            department: 'Warehouse',
            description: 'Electricity bill',
            vendor: 'Ad Agency',
            payment_method: 'Bank Transfer',
            amount: 15000,
            status: 'Pending',
            approved_by: { name: 'Liza Rey...', avatar: '/user.png' }
        },
        {
            id: 'EXP-2026-005',
            date: 'Mar 10, 2026',
            category: 'Shipping',
            department: 'Operations',
            description: 'Courier service fees',
            vendor: 'Service Inc.',
            payment_method: 'Cash',
            amount: 9500,
            status: 'Approved',
            approved_by: { name: 'Carlos...', avatar: '/user.png' }
        },
        {
            id: 'EXP-2026-006',
            date: 'Mar 15, 2026',
            category: 'Software',
            department: 'Admin',
            description: 'Monthly ecommerce tools',
            vendor: 'Training Hub',
            payment_method: 'Credit Card',
            amount: 22000,
            status: 'Paid',
            approved_by: { name: 'Sofia Lee', avatar: '/user.png' }
        }
    ];

    return {
        success: true,
        message: 'Expenses fetched successfully',
        data: {
            expenses: mockExpenses,
            pagination: {
                total: 6,
                per_page: 15,
                current_page: 1,
                last_page: 1
            }
        }
    };
}

export async function getExpenseStats(): Promise<ApiResponse<ExpenseStats>> {
    return {
        success: true,
        message: 'Stats fetched successfully',
        data: {
            total_expenses: { amount: 83950, trend: 2.5 },
            outstanding_payables: { amount: 13700, trend: 2.5, percentage: 65 },
            overdue_payables: { amount: 4200, trend: 2.5, percentage: 65 },
            recurring_expenses: { amount: 248450, trend: 2.5, percentage: 65 }
        }
    };
}
