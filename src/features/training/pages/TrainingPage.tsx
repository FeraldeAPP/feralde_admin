import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTrainingModules } from '@/api/endpoints';
import type { TrainingModule } from '@/api/types';

export default function TrainingPage(): React.ReactElement {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['training', page],
    queryFn: () => getTrainingModules({ page, per_page: 15 }),
  });

  const result = data?.success ? data.data : null;

  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-bold text-gray-900">Training</h1>
        {result && (
          <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} modules</p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.modules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center text-gray-400">
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
