import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '@/api/endpoints';
import type { LeaderboardEntry } from '@/api/types';

export default function LeaderboardPage(): React.ReactElement {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard(),
  });

  const result = data?.success ? data.data : null;
  const entries = result?.entries ?? null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Leaderboard</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.period} &mdash; {entries?.length ?? 0} entries</p>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading leaderboard...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load leaderboard. Please try again.
        </div>
      )}

      {entries && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-center">Rank</th>
                  <th className="px-5 py-3 text-left">Owner</th>
                  <th className="px-5 py-3 text-left">Period</th>
                  <th className="px-5 py-3 text-right">Total Sales</th>
                  <th className="px-5 py-3 text-center">Orders</th>
                  <th className="px-5 py-3 text-center">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                      No leaderboard entries found
                    </td>
                  </tr>
                ) : (
                  entries.map((entry: LeaderboardEntry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          entry.rank === 1 ? 'bg-yellow-100 text-yellow-700'
                          : entry.rank === 2 ? 'bg-gray-200 text-gray-700'
                          : entry.rank === 3 ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-50 text-gray-500'
                        }`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {entry.distributor_id
                          ? <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Distributor #{entry.distributor_id}</span>
                          : entry.reseller_id
                          ? <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">Reseller #{entry.reseller_id}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{entry.period}</td>
                      <td className="px-5 py-3 text-right font-mono font-medium text-gray-900">
                        {parseFloat(entry.total_sales).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500">{entry.total_orders}</td>
                      <td className="px-5 py-3 text-center text-gray-500">
                        {entry.badge ?? <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
