import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInventory } from '@/api/endpoints';
import type { InventoryItem } from '@/api/types';

export default function InventoryPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory', page],
    queryFn: () => getInventory({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} records</p>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading inventory...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load inventory. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Variant</th>
                  <th className="px-5 py-3 text-left">Warehouse</th>
                  <th className="px-5 py-3 text-center">On Hand</th>
                  <th className="px-5 py-3 text-center">Reserved</th>
                  <th className="px-5 py-3 text-center">Damaged</th>
                  <th className="px-5 py-3 text-center">Reorder At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.inventory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                      No inventory records found
                    </td>
                  </tr>
                ) : (
                  result.inventory.map((item: InventoryItem) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        {item.variant ? (
                          <>
                            <p className="font-medium text-gray-900">{item.variant.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{item.variant.sku}</p>
                          </>
                        ) : (
                          <span className="text-gray-400 font-mono">variant #{item.variant_id}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {item.warehouse?.name ?? `warehouse #${item.warehouse_id}`}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`font-medium ${item.quantity_on_hand <= item.reorder_point ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.quantity_on_hand}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500">{item.quantity_reserved}</td>
                      <td className="px-5 py-3 text-center text-gray-500">{item.quantity_damaged}</td>
                      <td className="px-5 py-3 text-center text-gray-500">{item.reorder_point}</td>
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
