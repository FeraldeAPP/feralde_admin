import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDistributors } from '@/features/distributors/api';
import type { Distributor, DistributorRank } from '@/features/distributors/types';

const RANK_COLORS: Record<DistributorRank, string> = {
  STARTER: 'bg-gray-100 text-gray-600',
  BRONZE: 'bg-orange-100 text-orange-700',
  SILVER: 'bg-slate-100 text-slate-600',
  GOLD: 'bg-yellow-100 text-yellow-700',
  PLATINUM: 'bg-cyan-100 text-cyan-700',
  DIAMOND: 'bg-indigo-100 text-indigo-700',
};

function StatusBadge({ d }: { d: Distributor }): React.ReactElement {
  if (d.suspended_at) return <span className="text-red-600 font-medium">Suspended</span>;
  if (d.rejected_at) return <span className="text-gray-400 font-medium">Rejected</span>;
  if (d.approved_at) return <span className="text-emerald-600 font-medium">Approved</span>;
  return <span className="text-amber-600 font-medium">Pending</span>;
}

export default function DistributorsPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['distributors', page],
    queryFn: () => getDistributors({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Distributors</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} total</p>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading distributors...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load distributors. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Code</th>
                  <th className="px-5 py-3 text-center">Rank</th>
                  <th className="px-5 py-3 text-left">Assigned City</th>
                  <th className="px-5 py-3 text-right">Personal Sales</th>
                  <th className="px-5 py-3 text-right">Network Sales</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.distributors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                      No distributors found
                    </td>
                  </tr>
                ) : (
                  result.distributors.map((d: Distributor) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <Link
                          to={`/distributors/${d.id}`}
                          className="font-mono font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {d.distributor_code}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${RANK_COLORS[d.rank]}`}>
                          {d.rank}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {d.assigned_city ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-700">
                        {parseFloat(d.total_personal_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-700">
                        {parseFloat(d.total_network_sales).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3 text-center text-xs">
                        <StatusBadge d={d} />
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


