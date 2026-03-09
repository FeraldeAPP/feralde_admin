import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResellers } from '@/api/endpoints';
import type { Reseller } from '@/api/types';

export default function ResellersPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['resellers', page],
    queryFn: () => getResellers({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Resellers</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} total</p>
        )}
      </header>

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Code</th>
                  <th className="px-5 py-3 text-left">Referral</th>
                  <th className="px-5 py-3 text-left">City</th>
                  <th className="px-5 py-3 text-right">Total Sales</th>
                  <th className="px-5 py-3 text-center">Approved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.resellers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                      No resellers found
                    </td>
                  </tr>
                ) : (
                  result.resellers.map((r: Reseller) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono font-medium text-gray-900">{r.reseller_code}</td>
                      <td className="px-5 py-3 font-mono text-gray-500 text-xs">
                        {r.referral_code ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {r.city ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-700">
                        {parseFloat(r.total_sales).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-center text-xs text-gray-500">
                        {r.approved_at
                          ? new Date(r.approved_at).toLocaleDateString()
                          : <span className="text-amber-600 font-medium">Pending</span>}
                      </td>
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
