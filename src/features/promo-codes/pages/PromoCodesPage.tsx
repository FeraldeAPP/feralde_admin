import { createPromoCode, deletePromoCode, getPromoCodes, updatePromoCode } from '@/api/endpoints';
import type { PromoCode, PromoCodeType } from '@/api/types';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ModalMode = null | 'create' | { edit: PromoCode };

const PROMO_CODE_TYPES: PromoCodeType[] = [
  'PERCENTAGE_DISCOUNT',
  'FIXED_DISCOUNT',
  'FREE_SHIPPING',
  'BUY_X_GET_Y',
  'BUNDLE_DEAL',
];

const schema = z.object({
  code: z.string().min(1, 'Code is required'),
  description: z.string().nullable().optional(),
  type: z.enum([
    'PERCENTAGE_DISCOUNT',
    'FIXED_DISCOUNT',
    'FREE_SHIPPING',
    'BUY_X_GET_Y',
    'BUNDLE_DEAL',
  ] as const),
  value: z.number().min(0, 'Value must be 0 or more'),
  min_order_amount: z.number().nullable().optional(),
  max_discount: z.number().nullable().optional(),
  usage_limit: z.number().int().nullable().optional(),
  per_user_limit: z.number().int().nullable().optional(),
  is_active: z.boolean().optional(),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

function PromoCodeModal({
  mode,
  onClose,
}: {
  mode: Exclude<ModalMode, null>;
  onClose: () => void;
}): React.ReactElement {
  const queryClient = useQueryClient();
  const editing = mode !== 'create' ? mode.edit : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? {
          code: editing.code,
          description: editing.description ?? null,
          type: editing.type,
          value: parseFloat(editing.value),
          min_order_amount:
            editing.min_order_amount !== null
              ? parseFloat(editing.min_order_amount)
              : null,
          max_discount:
            editing.max_discount !== null
              ? parseFloat(editing.max_discount)
              : null,
          usage_limit: editing.usage_limit ?? null,
          per_user_limit: editing.per_user_limit ?? null,
          is_active: editing.is_active,
          starts_at: editing.starts_at ? editing.starts_at.slice(0, 10) : null,
          ends_at: editing.ends_at ? editing.ends_at.slice(0, 10) : null,
        }
      : {
          code: '',
          description: null,
          type: 'PERCENTAGE_DISCOUNT',
          value: 0,
          min_order_amount: null,
          max_discount: null,
          usage_limit: null,
          per_user_limit: null,
          is_active: true,
          starts_at: null,
          ends_at: null,
        },
  });

  const createMutation = useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormValues }) =>
      updatePromoCode(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      onClose();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const mutationData = createMutation.data ?? updateMutation.data;
  const apiErrorMessage =
    mutationData && !mutationData.success ? mutationData.message : null;

  const onSubmit = (values: FormValues): void => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2
          id="promo-modal-title"
          className="text-lg font-bold text-gray-900 mb-5"
        >
          {editing ? 'Edit Promo Code' : 'New Promo Code'}
        </h2>

        {(mutationError || apiErrorMessage) && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {mutationError instanceof Error
              ? mutationError.message
              : apiErrorMessage ?? 'An error occurred'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">
              Code <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="promo-code"
              type="text"
              {...register('code')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="promo-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="promo-description"
              rows={2}
              {...register('description')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="promo-type" className="block text-sm font-medium text-gray-700 mb-1">
              Type <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <select
              id="promo-type"
              {...register('type')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROMO_CODE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="promo-value" className="block text-sm font-medium text-gray-700 mb-1">
              Value <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="promo-value"
              type="number"
              step="0.01"
              min={0}
              {...register('value', { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.value && (
              <p className="mt-1 text-xs text-red-600">{String(errors.value.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="promo-min-order" className="block text-sm font-medium text-gray-700 mb-1">
                Min Order Amount
              </label>
              <input
                id="promo-min-order"
                type="number"
                step="0.01"
                min={0}
                {...register('min_order_amount', {
                  setValueAs: (v: string) => (v === '' ? null : parseFloat(v)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="promo-max-discount" className="block text-sm font-medium text-gray-700 mb-1">
                Max Discount
              </label>
              <input
                id="promo-max-discount"
                type="number"
                step="0.01"
                min={0}
                {...register('max_discount', {
                  setValueAs: (v: string) => (v === '' ? null : parseFloat(v)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="promo-usage-limit" className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <input
                id="promo-usage-limit"
                type="number"
                min={0}
                {...register('usage_limit', {
                  setValueAs: (v: string) => (v === '' ? null : parseInt(v, 10)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="promo-per-user" className="block text-sm font-medium text-gray-700 mb-1">
                Per User Limit
              </label>
              <input
                id="promo-per-user"
                type="number"
                min={0}
                {...register('per_user_limit', {
                  setValueAs: (v: string) => (v === '' ? null : parseInt(v, 10)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="promo-starts-at" className="block text-sm font-medium text-gray-700 mb-1">
                Starts At
              </label>
              <input
                id="promo-starts-at"
                type="date"
                {...register('starts_at', {
                  setValueAs: (v: string) => (v === '' ? null : v),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="promo-ends-at" className="block text-sm font-medium text-gray-700 mb-1">
                Ends At
              </label>
              <input
                id="promo-ends-at"
                type="date"
                {...register('ends_at', {
                  setValueAs: (v: string) => (v === '' ? null : v),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="promo-active"
              type="checkbox"
              {...register('is_active')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="promo-active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PromoCodesPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalMode>(null);
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission('promo_codes.create');
  const canUpdate = hasPermission('promo_codes.update');
  const canDelete = hasPermission('promo_codes.delete');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['promo-codes', page],
    queryFn: () => getPromoCodes({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  const deleteMutation = useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
    },
  });

  const handleDelete = (promo: PromoCode): void => {
    if (!window.confirm(`Delete promo code "${promo.code}"? This cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(promo.id);
  };

  return (
    <main className="flex-1 overflow-auto p-6 space-y-5" style={{ scrollbarGutter: 'stable' }}>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Promo Codes</h1>
          {result && (
            <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} total</p>
          )}
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setModal('create')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            New Promo Code
          </button>
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

      {deleteMutation.isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to delete promo code. Please try again.
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
                  {(canUpdate || canDelete) && (
                    <th className="px-5 py-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.promo_codes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canUpdate || canDelete ? 7 : 6}
                      className="px-5 py-16 text-center text-gray-400"
                    >
                      No promo codes found
                    </td>
                  </tr>
                ) : (
                  result.promo_codes.map((promo: PromoCode) => (
                    <tr key={promo.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-mono font-medium text-gray-900">{promo.code}</p>
                        {promo.description && (
                          <p className="text-xs text-gray-400 truncate max-w-xs">
                            {promo.description}
                          </p>
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
                        <span
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                            promo.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {promo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {(canUpdate || canDelete) && (
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {canUpdate && (
                              <button
                                type="button"
                                onClick={() => setModal({ edit: promo })}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDelete(promo)}
                                disabled={deleteMutation.isPending}
                                className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            )}
                          </div>
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
              <span>
                Page {result.pagination.current_page} of {result.pagination.last_page}
              </span>
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

      {modal !== null && (
        <PromoCodeModal mode={modal} onClose={() => setModal(null)} />
      )}
    </main>
  );
}
