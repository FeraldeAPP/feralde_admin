import { createBundle, deleteBundle, getBundles, updateBundle } from '@/features/bundles/api';
import type { Bundle, BundleType } from '@/features/bundles/types';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ModalMode = null | 'create' | { edit: Bundle };

const BUNDLE_TYPES: BundleType[] = ['FIXED', 'DYNAMIC', 'GIFT_SET'];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  type: z.enum(['FIXED', 'DYNAMIC', 'GIFT_SET'] as const),
  image_url: z.string().nullable().optional(),
  retail_price: z.number().min(0, 'Retail price must be 0 or more'),
  distributor_price: z.number().min(0, 'Distributor price must be 0 or more'),
  is_active: z.boolean().optional(),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

function BundleModal({
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
          name: editing.name,
          description: editing.description ?? null,
          type: editing.type,
          image_url: editing.image_url ?? null,
          retail_price: parseFloat(editing.retail_price),
          distributor_price: parseFloat(editing.distributor_price),
          is_active: editing.is_active,
          starts_at: editing.starts_at ? editing.starts_at.slice(0, 10) : null,
          ends_at: editing.ends_at ? editing.ends_at.slice(0, 10) : null,
        }
      : {
          name: '',
          description: null,
          type: 'FIXED',
          image_url: null,
          retail_price: 0,
          distributor_price: 0,
          is_active: true,
          starts_at: null,
          ends_at: null,
        },
  });

  const createMutation = useMutation({
    mutationFn: createBundle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bundles'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormValues }) =>
      updateBundle(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bundles'] });
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
      aria-labelledby="bundle-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2
          id="bundle-modal-title"
          className="text-lg font-bold text-gray-900 mb-5"
        >
          {editing ? 'Edit Bundle' : 'New Bundle'}
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
            <label htmlFor="bundle-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="bundle-name"
              type="text"
              {...register('name')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bundle-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="bundle-description"
              rows={3}
              {...register('description')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="bundle-type" className="block text-sm font-medium text-gray-700 mb-1">
              Type <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <select
              id="bundle-type"
              {...register('type')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BUNDLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bundle-image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              id="bundle-image"
              type="url"
              {...register('image_url', {
                setValueAs: (v: string) => (v === '' ? null : v),
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bundle-retail" className="block text-sm font-medium text-gray-700 mb-1">
                Retail Price <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <input
                id="bundle-retail"
                type="number"
                step="0.01"
                min={0}
                {...register('retail_price', { valueAsNumber: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.retail_price && (
                <p className="mt-1 text-xs text-red-600">{String(errors.retail_price.message)}</p>
              )}
            </div>
            <div>
              <label htmlFor="bundle-distributor" className="block text-sm font-medium text-gray-700 mb-1">
                Distributor Price <span aria-hidden="true" className="text-red-500">*</span>
              </label>
              <input
                id="bundle-distributor"
                type="number"
                step="0.01"
                min={0}
                {...register('distributor_price', { valueAsNumber: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.distributor_price && (
                <p className="mt-1 text-xs text-red-600">{String(errors.distributor_price.message)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bundle-starts-at" className="block text-sm font-medium text-gray-700 mb-1">
                Starts At
              </label>
              <input
                id="bundle-starts-at"
                type="date"
                {...register('starts_at', {
                  setValueAs: (v: string) => (v === '' ? null : v),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="bundle-ends-at" className="block text-sm font-medium text-gray-700 mb-1">
                Ends At
              </label>
              <input
                id="bundle-ends-at"
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
              id="bundle-active"
              type="checkbox"
              {...register('is_active')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="bundle-active" className="text-sm font-medium text-gray-700">
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

export default function BundlesPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalMode>(null);
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission('bundles.create');
  const canUpdate = hasPermission('bundles.update');
  const canDelete = hasPermission('bundles.delete');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bundles', page],
    queryFn: () => getBundles({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  const deleteMutation = useMutation({
    mutationFn: deleteBundle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });

  const handleDelete = (bundle: Bundle): void => {
    if (!window.confirm(`Delete bundle "${bundle.name}"? This cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(bundle.id);
  };

  return (
    <main className="flex-1 overflow-auto p-6 space-y-5" style={{ scrollbarGutter: 'stable' }}>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bundles</h1>
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
            New Bundle
          </button>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading bundles...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load bundles. Please try again.
        </div>
      )}

      {deleteMutation.isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to delete bundle. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-right">Retail Price</th>
                  <th className="px-5 py-3 text-right">Distributor Price</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  {(canUpdate || canDelete) && (
                    <th className="px-5 py-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.bundles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canUpdate || canDelete ? 6 : 5}
                      className="px-5 py-16 text-center text-gray-400"
                    >
                      No bundles found
                    </td>
                  </tr>
                ) : (
                  result.bundles.map((bundle: Bundle) => (
                    <tr key={bundle.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{bundle.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{bundle.slug}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                          {bundle.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-700">
                        {parseFloat(bundle.retail_price).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-gray-700">
                        {parseFloat(bundle.distributor_price).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                            bundle.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {bundle.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {(canUpdate || canDelete) && (
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {canUpdate && (
                              <button
                                type="button"
                                onClick={() => setModal({ edit: bundle })}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDelete(bundle)}
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
        <BundleModal mode={modal} onClose={() => setModal(null)} />
      )}
    </main>
  );
}


