import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useProducts } from '../hooks/use-products';
import { useAuth } from '@/hooks/use-auth';
import ProductRow from '../components/ProductRow.new';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Add01Icon,
    Search01Icon,
    ArrowDown01Icon,
    Upload06Icon,
    FilterMailIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProductFilters } from '../types';

export default function ProductsPage() {
    const { hasPermission } = useAuth();
    const { location } = useRouterState();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [exportOpen, setExportOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const handleExport = (format: 'pdf' | 'docx' | 'svg' | 'html') => {
        console.log(`Exporting as ${format}`);
    };

    const filters: ProductFilters = {
        per_page: 15,
        page,
        search: search || undefined,
    };

    const { data, isLoading, isError } = useProducts(filters);
    const canCreate = hasPermission('products.create');
    const result = data?.success ? data.data : null;
    const totalPages = result?.pagination.last_page ?? 1;
    const currentPage = result?.pagination.current_page ?? page;

    const pageNumbers: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);
        if (currentPage > 3) pageNumbers.push('ellipsis');
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pageNumbers.push(i);
        }
        if (currentPage < totalPages - 2) pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

    const TABS = [
        { label: 'My Products', to: '/products' },
        { label: 'Categories', to: '/categories' },
        { label: 'Bundles', to: '/bundles' },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-h-full bg-white">

            {/* Date + Export As */}
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-stone-400">{today}</p>
                <div className="relative">
    <DropdownMenu open={exportOpen} onOpenChange={setExportOpen}>
    <DropdownMenuTrigger className="flex items-center gap-1.5 border border-stone-200 text-stone-600 shrink-0 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8">
        <span className="hidden sm:inline">Export As</span>
        <span className="hidden sm:inline w-px h-3.5 bg-stone-300" />
        <HugeiconsIcon 
            icon={ArrowDown01Icon} 
            size={14} 
            className={`transition-transform duration-200 ${exportOpen ? 'rotate-180' : ''}`}
        />
    </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" className="w-29 min-w-0">
            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => handleExport('docx')}>.Docx</DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => handleExport('svg')}>SVG</DropdownMenuItem>
            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => handleExport('html')}>HTML</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</div>
</div>

            {/* Page Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">All Products</h1>

            {/* Search + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1 sm:max-w-sm">
                    <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400"
                    />
                </div>

                <div className="hidden md:flex items-center text-xs text-stone-400 shrink-0">
                    Last Updated: {lastUpdated}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    {canCreate && (
                        <Link
                            to="/products/new"
                            className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
                        >
                            <span className="hidden sm:inline">Add Product</span>
                            <HugeiconsIcon icon={Add01Icon} size={14} />
                        </Link>
                    )}
                        <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-stone-200 text-stone-600">
    <span className="hidden sm:inline">Import</span>
    <HugeiconsIcon icon={Upload06Icon} size={14} className="rotate-180" />
</Button>
<DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
    <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 border border-stone-200 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 font-medium">
        <span className="hidden sm:inline">{activeFilter ?? 'Filter'}</span>
        <HugeiconsIcon 
            icon={FilterMailIcon} 
            size={15} 
            className={`transition-transform duration-200 ${filterOpen ? 'rotate-180' : 'rotate-0'}`}
        />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" side="bottom" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0">
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Price')}>By Price</DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Name')}>By Name</DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Bundle')}>By Bundle</DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Category')}>By Category</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
                    </div>
                </div>

            {/* Tabs — real navigation */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="flex items-center gap-0 border-b border-stone-200 min-w-max sm:min-w-0">
                    {TABS.map((tab) => (
                        <Link
                            key={tab.label}
                            to={tab.to}
                            className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                                location.pathname === tab.to
                                    ? 'border-stone-900 text-stone-900'
                                    : 'border-transparent text-stone-400 hover:text-stone-700'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="py-16 text-center text-sm text-stone-400">
                    Loading products...
                </div>
            )}

            {/* Error */}
            {isError && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to load products. Please try again.
                </div>
            )}

            {/* Table */}
            {result && (
                <>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-stone-100">
                                    <th className="pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6 pl-4 sm:pl-0">
                                        <div className="flex items-center gap-1">
                                            Product Name
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                                                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th className="pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6 hidden sm:table-cell">Collection</th>
                                    <th className="pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6 hidden md:table-cell">Size Variants</th>
                                    <th className="pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6">Price (₱)</th>
                                    <th className="pb-3 text-right text-xs font-medium text-stone-400 pr-4 sm:pr-0">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center text-stone-400">
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
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <span className="text-xs text-stone-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
                            </button>
                            {pageNumbers.map((n, i) =>
                                n === 'ellipsis' ? (
                                    <span key={`e-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-stone-400">…</span>
                                ) : (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setPage(n)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                                            currentPage === n
                                                ? 'bg-stone-900 text-white'
                                                : 'border border-stone-200 text-stone-500 hover:bg-stone-50'
                                        }`}
                                    >
                                        {n}
                                    </button>
                                )
                            )}
                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}