import { approveReseller, getResellerCityStats, getResellers } from '@/features/resellers/api';
import PhilippinesMap from '@/features/resellers/components/PhilippinesMap';
import type { Reseller, ResellerCityStat } from '@/features/resellers/types';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function ResellersPage(): React.ReactElement {
    const [page, setPage] = useState(1);
    const [focusCity, setFocusCity] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();
    const canUpdate = hasPermission('resellers.update');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['resellers', page],
        queryFn: () => getResellers({ page, per_page: 15 }),
    });

    const { data: cityData, isLoading: cityLoading } = useQuery({
        queryKey: ['reseller-city-stats'],
        queryFn: getResellerCityStats,
    });

    const result = data?.success ? data.data : null;
    const cityStats: ResellerCityStat[] = cityData?.success ? cityData.data : [];

    const totalResellers = result?.pagination.total ?? 0;
    const totalCities = cityStats.length;

    const approveMutation = useMutation({
        mutationFn: (id: number) => approveReseller(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['resellers'] });
        },
    });

    return (
        <div className="p-6 space-y-6" style={{ scrollbarGutter: 'stable' }}>

            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Resellers</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {totalResellers} total &mdash; {totalCities} cit{totalCities !== 1 ? 'ies' : 'y'} covered
                    </p>
                </div>
            </header>

            {/* Map + City Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* Map */}
                <section className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700">Reseller Distribution by City</h2>
                    <p className="text-xs text-gray-400">
                        Click any city to see its reseller count and approval rate.
                    </p>
                    {cityLoading ? (
                        <div className="h-64 flex items-center justify-center text-sm text-gray-400">
                            Loading map...
                        </div>
                    ) : (
                        <PhilippinesMap stats={cityStats} focusCity={focusCity} />
                    )}
                </section>

                {/* City Rankings */}
                <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 space-y-3">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700">Rankings by City</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Click a city to zoom the map</p>
                        </div>
                        <input
                            type="search"
                            placeholder="Search city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    {cityLoading ? (
                        <div className="px-5 py-10 text-center text-sm text-gray-400">Loading...</div>
                    ) : cityStats.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm text-gray-400">
                            No city data yet. Resellers without a city are not shown.
                        </div>
                    ) : (
                        <ol className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                            {cityStats
                                .filter((s) => s.city.toLowerCase().includes(search.toLowerCase()))
                                .map((stat, i) => {
                                    const pct = Math.round((stat.total / (cityStats[0]?.total ?? 1)) * 100);
                                    return (
                                        <li
                                            key={stat.city}
                                            className="px-5 py-3 space-y-1 cursor-pointer hover:bg-indigo-50 transition-colors"
                                            onClick={() => setFocusCity(stat.city)}
                                        >
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-xs font-mono text-gray-400 w-5 shrink-0">
                                                        {i + 1}
                                                    </span>
                                                    <span className="font-medium text-gray-800 truncate">{stat.city}</span>
                                                </div>
                                                <span className="font-bold text-indigo-700 tabular-nums shrink-0 ml-2">
                                                    {stat.total}
                                                </span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-gray-100">
                                                <div
                                                    className="h-1.5 rounded-full bg-indigo-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </li>
                                    );
                            })}
                        </ol>
                    )}
                </section>
            </div>

            {/* Resellers Table */}
            <section>
                {isLoading && (
                    <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
                        Loading resellers...
                    </div>
                )}

                {isError && (
                    <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        Failed to load resellers. Please try again.
                    </div>
                )}

                {result && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="text-sm font-semibold text-gray-700">All Resellers</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100 text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        <th className="px-5 py-3 text-left">Code</th>
                                        <th className="px-5 py-3 text-left">Name</th>
                                        <th className="px-5 py-3 text-left">City</th>
                                        <th className="px-5 py-3 text-right">Total Sales</th>
                                        <th className="px-5 py-3 text-center">Status</th>
                                        {canUpdate && (
                                            <th className="px-5 py-3 text-center">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {result.resellers.length === 0 ? (
                                        <tr>
                                            <td colSpan={canUpdate ? 6 : 5} className="px-5 py-16 text-center text-gray-400">
                                                No resellers found
                                            </td>
                                        </tr>
                                    ) : (
                                        result.resellers.map((r: Reseller) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="px-5 py-3 font-mono font-medium text-gray-900">
                                                    {r.reseller_code}
                                                </td>
                                                <td className="px-5 py-3 text-gray-700">
                                                    {r.first_name || r.last_name
                                                        ? `${r.first_name ?? ''} ${r.last_name ?? ''}`.trim()
                                                        : <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-5 py-3 text-gray-700">
                                                    {r.city ?? <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-5 py-3 text-right font-mono text-gray-700">
                                                    {parseFloat(r.total_sales).toFixed(2)}
                                                </td>
                                                <td className="px-5 py-3 text-center text-xs">
                                                    {r.approved_at
                                                        ? <span className="text-emerald-600 font-medium">Approved</span>
                                                        : <span className="text-amber-600 font-medium">Pending</span>}
                                                </td>
                                                {canUpdate && (
                                                    <td className="px-5 py-3 text-center">
                                                        {!r.approved_at && (
                                                            <button
                                                                type="button"
                                                                onClick={() => approveMutation.mutate(r.id)}
                                                                disabled={approveMutation.isPending}
                                                                className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                {approveMutation.isPending ? 'Approving...' : 'Approve'}
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {result.pagination.last_page > 1 && (
                            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
                                <span>Page {result.pagination.current_page} of {result.pagination.last_page}</span>
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => p - 1)}
                                        className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        disabled={page === result.pagination.last_page}
                                        onClick={() => setPage((p) => p + 1)}
                                        className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
