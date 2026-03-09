import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommissions, approveCommission, payCommission } from '@/features/commissions/api';
import { useAuth } from '@/hooks/use-auth';
import type { Commission, CommissionStatus } from '@/features/commissions/types';

const STATUS_COLORS: Record<CommissionStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  PAID: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const ALL_STATUSES: CommissionStatus[] = ['PENDING', 'APPROVED', 'PAID', 'CANCELLED'];

interface CommissionRowProps {
  commission: Commission;
  canUpdate: boolean;
}

function CommissionRow({ commission: c, canUpdate }: CommissionRowProps): React.ReactElement {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => approveCommission(c.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });

  const payMutation = useMutation({
    mutationFn: () => payCommission(c.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-5 py-3">
        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
          {c.commission_type.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-5 py-3 text-right font-mono text-gray-700">{parseFloat(c.base_amount).toFixed(2)}</td>
      <td className="px-5 py-3 text-right font-mono text-gray-500">{parseFloat(c.rate).toFixed(2)}%</td>
      <td className="px-5 py-3 text-right font-mono font-medium text-gray-900">{parseFloat(c.amount).toFixed(2)}</td>
      <td className="px-5 py-3 text-center">
        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>
          {c.status}
        </span>
      </td>
      <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
        {new Date(c.created_at).toLocaleDateString()}
      </td>
      <td className="px-5 py-3 text-center">
        {canUpdate && c.status === 'PENDING' && (
          <button
            type="button"
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {approveMutation.isPending ? 'Approving...' : 'Approve'}
          </button>
        )}
        {canUpdate && c.status === 'APPROVED' && (
          <button
            type="button"
            onClick={() => payMutation.mutate()}
            disabled={payMutation.isPending}
            className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {payMutation.isPending ? 'Processing...' : 'Mark Paid'}
          </button>
        )}
      </td>
    </tr>
  );
}

export default function CommissionsPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<CommissionStatus | ''>('');
  const { hasPermission } = useAuth();
  const canUpdate = hasPermission('commissions.update');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['commissions', page, status],
    queryFn: () => getCommissions({ page, per_page: 15, ...(status ? { status } : {}) }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Commissions</h1>
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
          Loading commissions...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load commissions. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-right">Base</th>
                  <th className="px-5 py-3 text-right">Rate</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.commissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-gray-400">
                      No commissions found
                    </td>
                  </tr>
                ) : (
                  result.commissions.map((c: Commission) => (
                    <CommissionRow key={c.id} commission={c} canUpdate={canUpdate} />
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
    </div>
  );
}


