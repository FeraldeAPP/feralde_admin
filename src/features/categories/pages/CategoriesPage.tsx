import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/endpoints';
import { useAuth } from '@/hooks/use-auth';
import type { Category } from '@/api/types/catalog';

type ModalMode = null | 'create' | { edit: Category };

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  parent_id: z.number().nullable().optional(),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

function CategoryModal({
  mode,
  categories,
  onClose,
}: {
  mode: Exclude<ModalMode, null>;
  categories: Category[];
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
          parent_id: editing.parent_id ?? null,
          sort_order: editing.sort_order,
          is_active: editing.is_active,
        }
      : {
          name: '',
          description: null,
          parent_id: null,
          sort_order: 0,
          is_active: true,
        },
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormValues }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
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

  const parentOptions = categories.filter(
    (c) => editing === null || c.id !== editing.id,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2
          id="category-modal-title"
          className="text-lg font-bold text-gray-900 mb-5"
        >
          {editing ? 'Edit Category' : 'New Category'}
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
            <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              {...register('name')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cat-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="cat-description"
              rows={3}
              {...register('description')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="cat-parent" className="block text-sm font-medium text-gray-700 mb-1">
              Parent Category
            </label>
            <select
              id="cat-parent"
              {...register('parent_id', {
                setValueAs: (v: string) => (v === '' ? null : Number(v)),
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">None</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cat-sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              id="cat-sort"
              type="number"
              min={0}
              {...register('sort_order', { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.sort_order && (
              <p className="mt-1 text-xs text-red-600">{errors.sort_order.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="cat-active"
              type="checkbox"
              {...register('is_active')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="cat-active" className="text-sm font-medium text-gray-700">
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

export default function CategoriesPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalMode>(null);
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission('categories.create');
  const canUpdate = hasPermission('categories.update');
  const canDelete = hasPermission('categories.delete');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories', page],
    queryFn: () => getCategories({ page, per_page: 20 }),
  });

  const allCategoriesQuery = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => getCategories({ per_page: 200 }),
  });

  const result = data?.success ? data.data : null;
  const allCategories =
    allCategoriesQuery.data?.success
      ? allCategoriesQuery.data.data.categories
      : [];

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleDelete = (cat: Category): void => {
    if (!window.confirm(`Delete category "${cat.name}"? This cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(cat.id);
  };

  return (
    <main className="flex-1 overflow-auto p-6 space-y-5" style={{ scrollbarGutter: 'stable' }}>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
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
            New Category
          </button>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading categories...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load categories. Please try again.
        </div>
      )}

      {deleteMutation.isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to delete category. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Slug</th>
                  <th className="px-5 py-3 text-left">Parent</th>
                  <th className="px-5 py-3 text-center">Sort</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  {(canUpdate || canDelete) && (
                    <th className="px-5 py-3 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canUpdate || canDelete ? 6 : 5}
                      className="px-5 py-16 text-center text-gray-400"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  result.categories.map((cat: Category) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {cat.parent_id
                          ? `#${cat.parent_id}`
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3 text-center text-gray-500">{cat.sort_order}</td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                            cat.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {(canUpdate || canDelete) && (
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {canUpdate && (
                              <button
                                type="button"
                                onClick={() => setModal({ edit: cat })}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDelete(cat)}
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
        <CategoryModal
          mode={modal}
          categories={allCategories}
          onClose={() => setModal(null)}
        />
      )}
    </main>
  );
}
