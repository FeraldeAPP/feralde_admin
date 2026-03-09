export interface LeaderboardEntry {
    id: number;
    period: string;
    distributor_id: number | null;
    reseller_id: number | null;
    total_sales: string;
    total_orders: number;
    rank: number;
    badge: string | null;
}

export interface LeaderboardData {
    period: string;
    entries: LeaderboardEntry[];
}
