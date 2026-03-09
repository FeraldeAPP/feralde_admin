import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrder, updateOrderStatus } from '@/features/orders/api';
import { useAuth } from '@/hooks/use-auth';
import type { OrderStatus } from '@/features/orders/types';

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

export default function OrderDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>Invalid order</div>;

  return <OrderDetailContent id={id} />;
}

function OrderDetailContent({ id }: { id: string }): React.ReactElement {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const canUpdateStatus = hasPermission('orders.update');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrder(Number(id)),
  });

  const order = data?.success ? data.data : null;

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  const mutation = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(Number(id), status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders', id] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleStatusSave = (): void => {
    if (!selectedStatus) return;
    mutation.mutate(selectedStatus);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <nav>
          <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
            &larr; Back to Orders
          </Link>
        </nav>
        <div className="mt-6 bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading order...
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6">
        <nav>
          <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
            &larr; Back to Orders
          </Link>
        </nav>
        <div role="alert" className="mt-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load order. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <nav>
        <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline">
          &larr; Back to Orders
        </Link>
      </nav>

      <header>
        <h1 className="text-xl font-bold text-gray-900 font-mono">{order.order_number}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
          <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
            order.payment_status === 'PAID'
              ? 'bg-green-100 text-green-700'
              : order.payment_status === 'FAILED'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {order.payment_status}
          </span>
        </div>
      </header>

      <section aria-labelledby="order-details-heading">
        <h2 id="order-details-heading" className="text-sm font-semibold text-gray-700 mb-3">Order Details</h2>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-0 sm:grid-cols-3">
            <div className="px-5 py-3">
              <dt className="text-xs text-gray-500">Subtotal</dt>
              <dd className="font-mono text-gray-900 text-sm mt-0.5">{parseFloat(order.subtotal).toFixed(2)}</dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-xs text-gray-500">Shipping Fee</dt>
              <dd className="font-mono text-gray-900 text-sm mt-0.5">{parseFloat(order.shipping_fee).toFixed(2)}</dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-xs text-gray-500">Discount</dt>
              <dd className="font-mono text-gray-900 text-sm mt-0.5">{parseFloat(order.discount_amount).toFixed(2)}</dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-xs text-gray-500">Tax</dt>
              <dd className="font-mono text-gray-900 text-sm mt-0.5">{parseFloat(order.tax_amount).toFixed(2)}</dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-xs text-gray-500">Total</dt>
              <dd className="font-mono font-semibold text-gray-900 text-sm mt-0.5">{parseFloat(order.total_amount).toFixed(2)}</dd>
            </div>
            {order.pricing_tier && (
              <div className="px-5 py-3">
                <dt className="text-xs text-gray-500">Pricing Tier</dt>
                <dd className="text-gray-900 text-sm mt-0.5">{order.pricing_tier}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section aria-labelledby="order-dates-heading">
        <h2 id="order-dates-heading" className="text-sm font-semibold text-gray-700 mb-3">Dates</h2>
        <div className="bg-white rounded-xl border border-gray-200">
          <dl className="grid grid-cols-2 gap-x-6 sm:grid-cols-2">
            <div className="px-5 py-3">
              <dt className="text-xs text-gray-500">Created</dt>
              <dd className="text-gray-900 text-sm mt-0.5">{new Date(order.created_at).toLocaleString()}</dd>
            </div>
            <div className="px-5 py-3">
              <dt className="text-xs text-gray-500">Updated</dt>
              <dd className="text-gray-900 text-sm mt-0.5">{new Date(order.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </section>

      {canUpdateStatus && (
        <section aria-labelledby="update-status-heading">
          <h2 id="update-status-heading" className="text-sm font-semibold text-gray-700 mb-3">Update Status</h2>
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
            {mutation.isSuccess && (
              <div role="status" className="mb-3 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                Status updated successfully.
              </div>
            )}
            {mutation.isError && (
              <div role="alert" className="mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                Failed to update status. Please try again.
              </div>
            )}
            <div className="flex items-end gap-3">
              <div className="flex-1 max-w-xs">
                <label htmlFor="order-status-select" className="block text-xs text-gray-500 mb-1">
                  New Status
                </label>
                <select
                  id="order-status-select"
                  value={selectedStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value as OrderStatus | '')}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select status...</option>
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleStatusSave}
                disabled={!selectedStatus || mutation.isPending}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {mutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


