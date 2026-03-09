import {
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncements,
    getMarketingAssets,
    publishAnnouncement,
    updateAnnouncement,
} from '@/api/endpoints';
import type { Announcement, MarketingAsset } from '@/api/types';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Tab = 'assets' | 'announcements';
type ModalMode = null | 'create' | { edit: Announcement };

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  image_url: z.string().nullable().optional(),
  target_roles: z.array(z.string()).nullable().optional(),
  is_pinned: z.boolean().optional(),
  expires_at: z.string().nullable().optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

function AnnouncementModal({
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
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: editing
      ? {
          title: editing.title,
          body: editing.body,
          image_url: editing.image_url ?? null,
          target_roles: editing.target_roles ?? null,
          is_pinned: editing.is_pinned,
          expires_at: editing.expires_at ? editing.expires_at.slice(0, 10) : null,
        }
      : {
          title: '',
          body: '',
          image_url: null,
          target_roles: null,
          is_pinned: false,
          expires_at: null,
        },
  });

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AnnouncementFormValues }) =>
      updateAnnouncement(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
      onClose();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const mutationData = createMutation.data ?? updateMutation.data;
  const apiErrorMessage =
    mutationData && !mutationData.success ? mutationData.message : null;

  const onSubmit = (values: AnnouncementFormValues): void => {
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
      aria-labelledby="announcement-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2
          id="announcement-modal-title"
          className="text-lg font-bold text-gray-900 mb-5"
        >
          {editing ? 'Edit Announcement' : 'New Announcement'}
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
            <label htmlFor="ann-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="ann-title"
              type="text"
              {...register('title')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ann-body" className="block text-sm font-medium text-gray-700 mb-1">
              Body <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <textarea
              id="ann-body"
              rows={6}
              {...register('body')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            {errors.body && (
              <p className="mt-1 text-xs text-red-600">{errors.body.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ann-image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              id="ann-image"
              type="url"
              {...register('image_url', {
                setValueAs: (v: string) => (v === '' ? null : v),
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="ann-expires" className="block text-sm font-medium text-gray-700 mb-1">
              Expires At
            </label>
            <input
              id="ann-expires"
              type="date"
              {...register('expires_at', {
                setValueAs: (v: string) => (v === '' ? null : v),
              })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="ann-pinned"
              type="checkbox"
              {...register('is_pinned')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="ann-pinned" className="text-sm font-medium text-gray-700">
              Pinned
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

export default function MarketingPage(): React.ReactElement {
  const [tab, setTab] = useState<Tab>('assets');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalMode>(null);
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const canCreateAnn = hasPermission('marketing.create');
  const canUpdateAnn = hasPermission('marketing.update');
  const canDeleteAnn = hasPermission('marketing.delete');

  const assetsQuery = useQuery({
    queryKey: ['marketing-assets', page],
    queryFn: () => getMarketingAssets({ page, per_page: 15 }),
    enabled: tab === 'assets',
  });

  const announcementsQuery = useQuery({
    queryKey: ['announcements', page],
    queryFn: () => getAnnouncements({ page, per_page: 15 }),
    enabled: tab === 'announcements',
  });

  const assetResult = assetsQuery.data?.success ? assetsQuery.data.data : null;
  const announcementResult = announcementsQuery.data?.success ? announcementsQuery.data.data : null;

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: publishAnnouncement,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: number) => updateAnnouncement(id, { is_published: false }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  function handleDelete(a: Announcement): void {
    if (!window.confirm(`Delete announcement "${a.title}"? This cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(a.id);
  }

  function handlePublishToggle(a: Announcement): void {
    if (a.is_published) {
      unpublishMutation.mutate(a.id);
    } else {
      publishMutation.mutate(a.id);
    }
  }

  function switchTab(t: Tab): void {
    setTab(t);
    setPage(1);
  }

  return (
    <main className="flex-1 overflow-auto p-6 space-y-5" style={{ scrollbarGutter: 'stable' }}>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Marketing</h1>
        </div>
        {tab === 'announcements' && canCreateAnn && (
          <button
            type="button"
            onClick={() => setModal('create')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            New Announcement
          </button>
        )}
      </header>

      <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden text-sm w-fit">
        <button type="button" onClick={() => switchTab('assets')}
          className={`px-4 py-2 font-medium transition-colors ${tab === 'assets' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          Assets
        </button>
        <button type="button" onClick={() => switchTab('announcements')}
          className={`px-4 py-2 font-medium transition-colors ${tab === 'announcements' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          Announcements
        </button>
      </div>

      {tab === 'assets' && (
        <>
          {assetsQuery.isLoading && (
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
              Loading assets...
            </div>
          )}
          {assetsQuery.isError && (
            <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              Failed to load assets. Please try again.
            </div>
          )}
          {assetResult && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">
                {assetResult.pagination.total} assets
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Title</th>
                      <th className="px-5 py-3 text-center">Type</th>
                      <th className="px-5 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {assetResult.assets.length === 0 ? (
                      <tr><td colSpan={3} className="px-5 py-16 text-center text-gray-400">No assets found</td></tr>
                    ) : (
                      assetResult.assets.map((asset: MarketingAsset) => (
                        <tr key={asset.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3">
                            <p className="font-medium text-gray-900">{asset.title}</p>
                            {asset.description && (
                              <p className="text-xs text-gray-400 truncate max-w-sm">{asset.description}</p>
                            )}
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{asset.type}</span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                              asset.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {asset.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {assetResult.pagination.last_page > 1 && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
                  <span>Page {assetResult.pagination.current_page} of {assetResult.pagination.last_page}</span>
                  <div className="flex gap-1">
                    <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">Previous</button>
                    <button type="button" disabled={page === assetResult.pagination.last_page} onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'announcements' && (
        <>
          {announcementsQuery.isLoading && (
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
              Loading announcements...
            </div>
          )}
          {announcementsQuery.isError && (
            <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              Failed to load announcements. Please try again.
            </div>
          )}
          {deleteMutation.isError && (
            <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              Failed to delete announcement. Please try again.
            </div>
          )}
          {announcementResult && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">
                {announcementResult.pagination.total} announcements
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Title</th>
                      <th className="px-5 py-3 text-center">Pinned</th>
                      <th className="px-5 py-3 text-center">Published</th>
                      <th className="px-5 py-3 text-left">Expires</th>
                      {(canUpdateAnn || canDeleteAnn) && (
                        <th className="px-5 py-3 text-right">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {announcementResult.announcements.length === 0 ? (
                      <tr>
                        <td colSpan={canUpdateAnn || canDeleteAnn ? 5 : 4} className="px-5 py-16 text-center text-gray-400">
                          No announcements found
                        </td>
                      </tr>
                    ) : (
                      announcementResult.announcements.map((a: Announcement) => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-900">{a.title}</td>
                          <td className="px-5 py-3 text-center text-xs text-gray-500">{a.is_pinned ? 'Yes' : 'No'}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                              a.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {a.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-500 text-xs">
                            {a.expires_at ? new Date(a.expires_at).toLocaleDateString() : <span className="text-gray-300">No expiry</span>}
                          </td>
                          {(canUpdateAnn || canDeleteAnn) && (
                            <td className="px-5 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                {canUpdateAnn && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => setModal({ edit: a })}
                                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handlePublishToggle(a)}
                                      disabled={publishMutation.isPending || unpublishMutation.isPending}
                                      className="text-xs font-medium text-amber-600 hover:text-amber-800 disabled:opacity-50"
                                    >
                                      {a.is_published ? 'Unpublish' : 'Publish'}
                                    </button>
                                  </>
                                )}
                                {canDeleteAnn && (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(a)}
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
              {announcementResult.pagination.last_page > 1 && (
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
                  <span>Page {announcementResult.pagination.current_page} of {announcementResult.pagination.last_page}</span>
                  <div className="flex gap-1">
                    <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">Previous</button>
                    <button type="button" disabled={page === announcementResult.pagination.last_page} onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {modal !== null && (
        <AnnouncementModal mode={modal} onClose={() => setModal(null)} />
      )}
    </main>
  );
}
