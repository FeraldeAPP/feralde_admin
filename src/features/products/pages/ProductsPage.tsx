import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/use-products';
import { useAuth } from '@/hooks/use-auth';
import ProductRow from '../components/ProductRow';
import { IconPlus, IconSearch } from '@/components/Icons';
import type { ProductFilters } from '@/api/types';

type StatusFilter = 'all' | 'active' | 'inactive';

export default function ProductsPage() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const filters: ProductFilters = {
    per_page: 15,
    page,
    search: search || undefined,
    ...(status !== 'all' ? { is_active: status === 'active' } : {}),
  };

  const { data, isLoading, isError } = useProducts(filters);

  const canCreate = hasPermission('products.create');
  const result = data?.success ? data.data : null;

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSearch((fd.get('search') as string) ?? '');
    setPage(1);
  }

  function handleStatusChange(s: StatusFilter) {
    setStatus(s);
    setPage(1);
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          {result && (
            <p className="text-sm text-gray-500 mt-0.5">{result.pagination.total} total</p>
          )}
        </div>
        {canCreate && (
          <Link
            to="/products/new"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <IconPlus className="w-4 h-4" />
            Add product
          </Link>
        )}
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px] max-w-sm">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              name="search"
              type="search"
              placeholder="Search name or SKU..."
              defaultValue={search}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Status tabs */}
        <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden text-sm">
          {(['all', 'active', 'inactive'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={`px-3 py-2 font-medium capitalize transition-colors ${
                status === s
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading products...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load products. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">SKU</th>
                  <th className="px-5 py-3 text-center">Variants</th>
                  <th className="px-5 py-3 text-center">Flags</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  result.products.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
    </div>
  );
}
