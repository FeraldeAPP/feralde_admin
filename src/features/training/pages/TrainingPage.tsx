import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  getTrainingModules,
  createTrainingModule,
  updateTrainingModule,
  deleteTrainingModule,
  publishTrainingModule,
} from '@/api/endpoints';
import { useAuth } from '@/hooks/use-auth';
import type { TrainingModule } from '@/api/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().nullable().optional(),
  sort_order: z.number().int().min(0).optional(),
  is_published: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

type ModalState = null | 'create' | TrainingModule;

interface ModuleFormProps {
  initial: TrainingModule | null;
  onClose: () => void;
  onSaved: () => void;
}

function ModuleForm({ initial, onClose, onSaved }: ModuleFormProps): React.ReactElement {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? null,
      sort_order: initial?.sort_order ?? 0,
      is_published: initial?.is_published ?? false,
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: FormValues) =>
      createTrainingModule({
        title: payload.title,
        description: payload.description ?? null,
        sort_order: payload.sort_order,
        is_published: payload.is_published,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
      onSaved();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: FormValues) =>
      updateTrainingModule(initial!.id, {
        title: payload.title,
        description: payload.description ?? null,
        sort_order: payload.sort_order,
        is_published: payload.is_published,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
      onSaved();
    },
  });

  const mutationError = createMutation.error ?? updateMutation.error;

  function onSubmit(values: FormValues): void {
    if (initial) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        <header className="px-6 py-4 border-b border-gray-100">
          <h2 id="module-modal-title" className="text-base font-semibold text-gray-900">
            {initial ? 'Edit Module' : 'New Module'}
          </h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
          {mutationError instanceof Error && (
            <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {mutationError.message}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="module-title" className="block text-sm font-medium text-gray-700">
              Title <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="module-title"
              type="text"
              {...register('title')}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="module-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="module-description"
              rows={3}
              {...register('description')}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="module-sort-order" className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              id="module-sort-order"
              type="number"
              min={0}
              step={1}
              {...register('sort_order', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.sort_order && (
              <p className="text-xs text-red-600">{errors.sort_order.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="module-is-published"
              type="checkbox"
              {...register('is_published')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="module-is-published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initial ? 'Save Changes' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TrainingPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalState>(null);
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['training', page],
    queryFn: () => getTrainingModules({ page, per_page: 15 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTrainingModule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: number) => publishTrainingModule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: number) => updateTrainingModule(id, { is_published: false }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['training'] });
    },
  });

  function handleDelete(m: TrainingModule): void {
    if (!window.confirm(`Delete "${m.title}"? This action cannot be undone.`)) return;
    deleteMutation.mutate(m.id);
  }

  function handlePublishToggle(m: TrainingModule): void {
    if (m.is_published) {
      unpublishMutation.mutate(m.id);
    } else {
      publishMutation.mutate(m.id);
    }
  }

  function handleModalClose(): void {
    setModal(null);
  }

  function handleModalSaved(): void {
    setModal(null);
  }

  const result = data?.success ? data.data : null;

  const canCreate = hasPermission('training.create');
  const canUpdate = hasPermission('training.update');
  const canDelete = hasPermission('training.delete');
  const hasActions = canUpdate || canDelete;

  return (
    <div className="p-6 space-y-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Training</h1>
          {result && (
            <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} modules</p>
          )}
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={() => setModal('create')}
            className="shrink-0 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            New Module
          </button>
        )}
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading training modules...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load training modules. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-center">Order</th>
                  <th className="px-5 py-3 text-left">Title</th>
                  <th className="px-5 py-3 text-center">Published</th>
                  <th className="px-5 py-3 text-left">Created</th>
                  {hasActions && <th className="px-5 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.modules.length === 0 ? (
                  <tr>
                    <td colSpan={hasActions ? 5 : 4} className="px-5 py-16 text-center text-gray-400">
                      No training modules found
                    </td>
                  </tr>
                ) : (
                  result.modules.map((m: TrainingModule) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-center text-gray-400 text-xs">{m.sort_order}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{m.title}</p>
                        {m.description && (
                          <p className="text-xs text-gray-400 truncate max-w-md">{m.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                          m.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {m.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      {hasActions && (
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canUpdate && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setModal(m)}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePublishToggle(m)}
                                  disabled={publishMutation.isPending || unpublishMutation.isPending}
                                  className="text-xs font-medium text-amber-600 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {m.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                              </>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => handleDelete(m)}
                                disabled={deleteMutation.isPending}
                                className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {modal !== null && (
        <ModuleForm
          initial={modal === 'create' ? null : modal}
          onClose={handleModalClose}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}
