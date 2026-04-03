import { useQuery } from '@tanstack/react-query';
import { getExpenses, getExpenseStats } from '../api/accounting.api';
import type { ExpenseFilters } from '../types/accounting.types';

export function useExpenses(filters?: ExpenseFilters) {
    return useQuery({
        queryKey: ['expenses', filters],
        queryFn: () => getExpenses(filters),
    });
}

export function useExpenseStats() {
    return useQuery({
        queryKey: ['expense-stats'],
        queryFn: () => getExpenseStats(),
    });
}
