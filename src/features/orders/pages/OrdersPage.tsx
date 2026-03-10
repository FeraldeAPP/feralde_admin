import { getOrders } from '@/features/orders/api';
import type { Order, OrderStatus } from '@/features/orders/types';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RETURNED: 'bg-gray-100 text-gray-700',
};

const ALL_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED',
];

export default function OrdersPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', page, status],
    queryFn: () => getOrders({ page, per_page: 15, ...(status ? { status } : {}) }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} total</p>
        )}
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => { setStatus(''); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            status === '' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              status === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading orders...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load orders. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Order</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Payment</th>
                  <th className="px-5 py-3 text-right">Total</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  result.orders.map((order: Order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-mono font-medium text-gray-900">{order.order_number}</p>
                        {order.pricing_tier && (
                          <p className="text-xs text-gray-400">{order.pricing_tier}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                          order.payment_status === 'PAID'
                            ? 'bg-green-100 text-green-700'
                            : order.payment_status === 'FAILED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-700">
                        {parseFloat(order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <Link
                          to="/orders/$id"
                          params={{ id: String(order.id) }}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          View
                        </Link>
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


