import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useProducts } from '../hooks/use-products';
import { useAuth } from '@/hooks/use-auth';
import ProductRow from '../components/ProductRow.new';
import { HugeiconsIcon } from '@hugeicons/react';
import { TableSkeleton } from '@/components/loading/SkeletonLoaders';
import {
    Add01Icon,
    Search01Icon,
    ArrowDown01Icon,
    Upload06Icon,
    FilterMailIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    ShoppingBag01Icon,
    Tag01Icon,
    GiftIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import type { Product, ProductFilters } from '../types';

const columnHelper = createColumnHelper<Product>();

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

    const columns = [
        columnHelper.accessor('name', {
            header: () => (
                <div className="flex items-center gap-1">
                    Product Name
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </div>
            ),
            cell: (info) => {
                const product = info.row.original;
                const primaryImage = product.media?.find((m) => m.is_primary)?.url ?? product.media?.[0]?.url;
                return (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md overflow-hidden bg-stone-100 shrink-0">
                            {primaryImage ? (
                                <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-stone-200" />
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-stone-800 font-medium truncate max-w-[120px] sm:max-w-[240px]">{product.name}</p>
                    </div>
                );
            },
        }),
        columnHelper.accessor('category.name', {
            id: 'collection',
            header: 'Collection',
            cell: (info) => <span className="text-sm text-stone-500">{info.getValue() ?? '—'}</span>,
        }),
        columnHelper.display({
            id: 'variants',
            header: 'Size Variants',
            cell: (info) => {
                const product = info.row.original;
                const activeVariants = product.variants?.filter((v: any) => v.is_active) ?? [];
                const sizes = activeVariants.map((v) => v.size ?? v.name).filter(Boolean).join(' / ');
                return <span className="text-sm text-stone-500">{sizes || '—'}</span>;
            },
        }),
        columnHelper.display({
            id: 'price',
            header: 'Price (₱)',
            cell: (info) => {
                const product = info.row.original;
                const activeVariants = product.variants?.filter((v: any) => v.is_active) ?? [];
                const lowestPrice = activeVariants.length > 0
                    ? Math.min(...activeVariants.map((v) => {
                        const retail = v.pricing?.find((p) => p.tier === 'RETAIL' && p.is_active);
                        return retail ? parseFloat(retail.price) : 0;
                    }))
                    : null;
                return (
                    <span className="text-sm text-stone-800 font-medium">
                        {lowestPrice !== null ? `₱${lowestPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '—'}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Action</div>,
            cell: (info) => <ProductRow product={info.row.original} isOnlyActions />,
        }),
    ];

    const table = useReactTable({
        data: result?.products ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

    const TABS = [
        { label: 'My Products', to: '/products', icon: ShoppingBag01Icon },
        { label: 'Categories', to: '/categories', icon: Tag01Icon },
        { label: 'Bundles', to: '/bundles', icon: GiftIcon },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-h-full bg-white">

            {/* Date + Export As */}
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-stone-400">{today}</p>
                <div className="relative">
                    <DropdownMenu open={exportOpen} onOpenChange={setExportOpen}>
                        <DropdownMenuTrigger className="flex items-center justify-center gap-1.5 border border-stone-200 text-stone-600 shrink-0 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 focus:outline-none">
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
                        <DropdownMenuTrigger className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-stone-600 border border-stone-200 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 font-medium focus:outline-none">
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

            {/* Tabs Row */}
            <div className="flex items-center gap-4 text-xs font-bold border-b border-stone-100 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                {TABS.map((tab) => (
                    <Link
                        key={tab.label}
                        to={tab.to}
                        className={cn(
                            'pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-max',
                            location.pathname === tab.to ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                        )}
                    >
                        <HugeiconsIcon icon={tab.icon} size={12} />
                        {tab.label}
                        {result && location.pathname === tab.to && (
                            <span className="ml-1 text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                {result.pagination.total ?? 0}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <TableSkeleton rowCount={8} columnCount={6} />
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
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="border-b border-stone-100">
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className={`text-left text-xs font-medium text-stone-400
                                                    pb-3 px-2 sm:px-4 sm:pr-6
                                                    ${header.id === 'name' ? 'pl-2 sm:pl-0' : ''}
                                                    ${header.id === 'collection' ? 'hidden sm:table-cell' : ''}
                                                    ${header.id === 'variants' ? 'hidden md:table-cell' : ''}
                                                    ${header.id === 'actions' ? 'text-right px-2 sm:pr-0' : ''}
                                                `}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="py-16 text-center text-stone-400">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td
                                                    key={cell.id}
                                                    className={`py-2.5 sm:py-3.5 px-2 sm:px-6
                                                        ${cell.column.id === 'name' ? 'text-xs sm:text-sm font-medium' : 'text-xs sm:text-sm'}
                                                        ${cell.column.id === 'collection' ? 'hidden sm:table-cell' : ''}
                                                        ${cell.column.id === 'variants' ? 'hidden md:table-cell' : ''}
                                                        ${cell.column.id === 'actions' ? 'text-right px-2 sm:px-0' : ''}
                                                    `}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2 pt-2 border-t border-stone-100">
                        <span className="text-xs text-stone-400 order-2 sm:order-1">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1 order-1 sm:order-2">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
                            </button>
                            <div className="flex items-center gap-0.5">
                                {pageNumbers.map((n, i) =>
                                    n === 'ellipsis' ? (
                                        <span key={`e-${i}`} className="w-6 h-6 flex items-center justify-center text-xs text-stone-400">…</span>
                                    ) : (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setPage(n)}
                                            className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${currentPage === n
                                                ? 'bg-stone-900 text-white'
                                                : 'border border-stone-200 text-stone-500 hover:bg-stone-50'
                                                }`}
                                        >
                                            {n}
                                        </button>
                                    )
                                )}
                            </div>
                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="w-6 sm:w-7 h-6 sm:h-7 flex items-center justify-center rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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