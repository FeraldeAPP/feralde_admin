import { useQuery } from '@tanstack/react-query';
import { getWallets, getWalletStats } from '../api/wallets.api';
import type { WalletFilters } from '../types/wallets.types';

export function useWallets(filters?: WalletFilters) {
    return useQuery({
        queryKey: ['wallets', filters],
        queryFn: () => getWallets(filters),
    });
}

export function useWalletStats() {
    return useQuery({
        queryKey: ['wallet-stats'],
        queryFn: () => getWalletStats(),
    });
}
