import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMarketingAssets, getAnnouncements } from '@/api/endpoints';
import type { MarketingAsset, Announcement } from '@/api/types';

type Tab = 'assets' | 'announcements';

export default function MarketingPage(): React.ReactElement {
  const [tab, setTab] = useState<Tab>('assets');
  const [page, setPage] = useState(1);

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

  function switchTab(t: Tab): void {
    setTab(t);
    setPage(1);
  }

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Marketing</h1>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {announcementResult.announcements.length === 0 ? (
                      <tr><td colSpan={4} className="px-5 py-16 text-center text-gray-400">No announcements found</td></tr>
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
    </div>
  );
}
