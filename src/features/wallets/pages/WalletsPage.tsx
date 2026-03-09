import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWallets } from '@/api/endpoints';
import type { Wallet } from '@/api/types';

export default function WalletsPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['wallets', page],
    queryFn: () => getWallets({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Wallets</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} total</p>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading wallets...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load wallets. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Owner</th>
                  <th className="px-5 py-3 text-right">Balance</th>
                  <th className="px-5 py-3 text-right">Pending</th>
                  <th className="px-5 py-3 text-right">Lifetime Earned</th>
                  <th className="px-5 py-3 text-right">Lifetime Withdrawn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.wallets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                      No wallets found
                    </td>
                  </tr>
                ) : (
                  result.wallets.map((w: Wallet) => (
                    <tr key={w.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-700">
                        {w.distributor_id
                          ? <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Distributor #{w.distributor_id}</span>
                          : w.reseller_id
                          ? <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">Reseller #{w.reseller_id}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-medium text-gray-900">{parseFloat(w.balance).toFixed(2)}</td>
                      <td className="px-5 py-3 text-right font-mono text-amber-600">{parseFloat(w.pending_balance).toFixed(2)}</td>
                      <td className="px-5 py-3 text-right font-mono text-green-700">{parseFloat(w.lifetime_earned).toFixed(2)}</td>
                      <td className="px-5 py-3 text-right font-mono text-gray-500">{parseFloat(w.lifetime_withdrawn).toFixed(2)}</td>
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
                <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">
                  Previous
                </button>
                <button type="button" disabled={page === result.pagination.last_page} onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
