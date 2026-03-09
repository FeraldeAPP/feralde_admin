import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPromoCodes } from '@/api/endpoints';
import type { PromoCode } from '@/api/types';

export default function PromoCodesPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['promo-codes', page],
    queryFn: () => getPromoCodes({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Promo Codes</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} total</p>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading promo codes...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load promo codes. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Code</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-right">Value</th>
                  <th className="px-5 py-3 text-center">Usage</th>
                  <th className="px-5 py-3 text-center">Expires</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.promo_codes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                      No promo codes found
                    </td>
                  </tr>
                ) : (
                  result.promo_codes.map((promo: PromoCode) => (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-mono font-medium text-gray-900">{promo.code}</p>
                        {promo.description && (
                          <p className="text-xs text-gray-400 truncate max-w-xs">{promo.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                          {promo.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-700">
                        {promo.type === 'PERCENTAGE_DISCOUNT'
                          ? `${parseFloat(promo.value).toFixed(0)}%`
                          : parseFloat(promo.value).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500">
                        {promo.usage_count}
                        {promo.usage_limit !== null && ` / ${promo.usage_limit}`}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500 text-xs">
                        {promo.ends_at
                          ? new Date(promo.ends_at).toLocaleDateString()
                          : <span className="text-gray-300">No expiry</span>}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                          promo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {promo.is_active ? 'Active' : 'Inactive'}
                        </span>
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
