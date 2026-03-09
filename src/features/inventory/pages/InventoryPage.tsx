import { adjustInventory, getInventory } from '@/features/inventory/api';
import type { InventoryItem } from '@/features/inventory/types';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const adjustSchema = z.object({
  type: z.enum(['INCREMENT', 'DECREMENT', 'SET']),
  quantity: z.number().min(0, 'Quantity is required'),
  reason: z.string().optional(),
});

type AdjustFormValues = z.infer<typeof adjustSchema>;

export default function InventoryPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null);
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const canAdjust = hasPermission('inventory.update');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory', page],
    queryFn: () => getInventory({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustFormValues>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      type: 'INCREMENT',
      quantity: 0,
      reason: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: AdjustFormValues) => {
      if (!adjustTarget) {
        return Promise.reject(new Error('No target selected'));
      }
      return adjustInventory({
        variant_id: adjustTarget.variant_id,
        warehouse_id: adjustTarget.warehouse_id,
        quantity: values.quantity,
        type: values.type,
        reason: values.reason ?? undefined,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setAdjustTarget(null);
      reset();
    },
  });

  const openModal = (item: InventoryItem): void => {
    setAdjustTarget(item);
    reset({ type: 'INCREMENT', quantity: 0, reason: '' });
    mutation.reset();
  };

  const closeModal = (): void => {
    setAdjustTarget(null);
    reset();
    mutation.reset();
  };

  const onSubmit = (values: AdjustFormValues): void => {
    mutation.mutate(values);
  };

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
                  {canAdjust && (
                    <th className="px-5 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.inventory.length === 0 ? (
                  <tr>
                    <td colSpan={canAdjust ? 7 : 6} className="px-5 py-16 text-center text-gray-400">
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
                      {canAdjust && (
                        <td className="px-5 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => openModal(item)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            Adjust Stock
                          </button>
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

      {adjustTarget !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="adjust-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 id="adjust-modal-title" className="text-base font-semibold text-gray-900">Adjust Stock</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {adjustTarget.variant?.name ?? `Variant #${adjustTarget.variant_id}`}
                {' — '}
                {adjustTarget.warehouse?.name ?? `Warehouse #${adjustTarget.warehouse_id}`}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="px-6 py-4 space-y-4">
                {mutation.isError && (
                  <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                    Failed to adjust stock. Please try again.
                  </div>
                )}

                <div>
                  <label htmlFor="adjust-type" className="block text-xs font-medium text-gray-700 mb-1">
                    Adjustment Type
                  </label>
                  <select
                    id="adjust-type"
                    {...register('type')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="INCREMENT">INCREMENT</option>
                    <option value="DECREMENT">DECREMENT</option>
                    <option value="SET">SET</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adjust-quantity" className="block text-xs font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    id="adjust-quantity"
                    type="number"
                    min={0}
                    {...register('quantity', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-600">{String(errors.quantity.message)}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="adjust-reason" className="block text-xs font-medium text-gray-700 mb-1">
                    Reason <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="adjust-reason"
                    type="text"
                    {...register('reason')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.reason && (
                    <p className="mt-1 text-xs text-red-600">{errors.reason.message}</p>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {mutation.isPending ? 'Saving...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


