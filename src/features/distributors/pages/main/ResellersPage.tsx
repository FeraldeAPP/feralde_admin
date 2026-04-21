import { useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useMyResellers } from '@/features/resellers/hooks/use-resellers';
import { useMyDistributorProfile } from '@/features/distributors/hooks/use-distributors';
import { useAuth } from '@/hooks/use-auth';
import ResellerRow from '@/features/resellers/components/ResellerRow';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Search01Icon,
    ArrowDown01Icon,
    FilterMailIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    UserMultiple02Icon,
    Calendar01Icon,
    UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
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
import type { Reseller, ResellerFilters } from '@/features/resellers/types';

const columnHelper = createColumnHelper<Reseller>();

export default function ResellersPage() {
    const { hasPermission } = useAuth();
    const { location } = useRouterState();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [exportOpen, setExportOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    // Get current distributor profile (optional for UI, but backend handles data filtering)
    const { data: profileResponse } = useMyDistributorProfile();

    const handleExport = (format: 'pdf' | 'docx' | 'svg' | 'html') => {
        console.log(`Exporting as ${format}`);
    };

    const filters: ResellerFilters = {
        per_page: 15,
        page,
        search: search || undefined,
    };

    const { data, isLoading, isError } = useMyResellers(filters);
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
        columnHelper.accessor('first_name', {
            id: 'name',
            header: () => (
                <div className="flex items-center gap-1">
                    Reseller Name
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </div>
            ),
            cell: (info) => {
                const reseller = info.row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-stone-500 uppercase">
                                {reseller.first_name?.[0] || ''}{reseller.last_name?.[0] || ''}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-stone-800 font-medium truncate max-w-[200px]">
                                {reseller.first_name} {reseller.last_name}
                            </p>
                            <p className="text-[11px] text-stone-400">{reseller.email}</p>
                        </div>
                    </div>
                );
            },
        }),
        columnHelper.accessor('reseller_code', {
            header: 'Reseller Code',
            cell: (info) => <span className="text-sm text-stone-500 font-mono">{info.getValue()}</span>,
        }),
        columnHelper.accessor('city', {
            header: 'City',
            cell: (info) => <span className="text-sm text-stone-500">{info.getValue() ?? '—'}</span>,
        }),
        columnHelper.accessor('approved_at', {
            header: 'Join Date',
            cell: (info) => {
                const date = info.getValue();
                return <span className="text-sm text-stone-500">{date ? new Date(date).toLocaleDateString() : 'Pending'}</span>;
            },
        }),
        columnHelper.accessor('total_sales', {
            header: 'Lifetime Sales',
            cell: (info) => (
                <span className="text-sm text-stone-800 font-medium">
                    ₱{parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Action</div>,
            cell: (info) => <ResellerRow reseller={info.row.original} isOnlyActions />,
        }),
    ];

    const table = useReactTable({
        data: result?.resellers ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

    const TABS = [
        { label: 'My Resellers', to: '/distributor/resellers', icon: UserMultiple02Icon },
        { label: 'Network Stats', to: '/distributor/resellers/stats', icon: UserGroupIcon },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-h-full bg-white font-[var(--font-bricolage)]">

            {/* Date + Export As */}
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-stone-400 font-medium">{today}</p>
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
            <div>
                <p className="text-[12px] text-[#A5A5A5] font-medium leading-tight">Distributor Portal</p>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#393939]">My Resellers</h1>
            </div>

            {/* Search + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1 sm:max-w-sm">
                    <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input
                        placeholder="Search resellers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400 bg-white"
                    />
                </div>

                <div className="hidden md:flex items-center text-xs text-stone-400 shrink-0">
                    Last Updated: {lastUpdated}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                        <DropdownMenuTrigger className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-stone-600 border border-stone-200 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 font-medium focus:outline-none bg-white">
                                <span className="hidden sm:inline">{activeFilter ?? 'Filter'}</span>
                                <HugeiconsIcon
                                    icon={FilterMailIcon}
                                    size={15}
                                    className={`transition-transform duration-200 ${filterOpen ? 'rotate-180' : 'rotate-0'}`}
                                />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="bottom" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0">
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Sales')}>By Sales</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Name')}>By Name</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By City')}>By City</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('Pending Approval')}>Pending Approval</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tabs Row */}
            <div className="flex items-center gap-6 text-[13px] font-bold border-b border-stone-100 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                {TABS.map((tab) => (
                    <div
                        key={tab.label}
                        className={cn(
                            'pb-3 transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-max cursor-pointer',
                            location.pathname === tab.to ? 'text-[#393939] border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                        )}
                    >
                        <HugeiconsIcon icon={tab.icon} size={14} />
                        {tab.label}
                        {result && location.pathname === tab.to && (
                            <span className="ml-1 text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                {result.pagination.total ?? 0}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="py-24 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-stone-200 border-t-stone-900 mb-2"></div>
                    <p className="text-sm text-stone-400">Loading resellers...</p>
                </div>
            )}

            {/* Error */}
            {isError && (
                <div role="alert" className="rounded-xl bg-red-50 border border-red-100 px-6 py-4 text-sm text-red-700 flex items-center gap-3">
                    <HugeiconsIcon icon={Calendar01Icon} size={18} />
                    Failed to load resellers. Please check your connection and try again.
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
                                                className={`pb-4 text-left text-xs font-semibold text-stone-400 pr-4 sm:pr-6 
                                                    ${header.id === 'name' ? 'pl-4 sm:pl-0' : ''}
                                                    ${header.id === 'city' ? 'hidden sm:table-cell' : ''}
                                                    ${header.id === 'approved_at' ? 'hidden md:table-cell' : ''}
                                                    ${header.id === 'actions' ? 'text-right pr-4 sm:pr-0' : ''}
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
                                        <td colSpan={columns.length} className="py-24 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center mb-1">
                                                    <HugeiconsIcon icon={UserMultiple02Icon} size={24} className="text-stone-300" />
                                                </div>
                                                <h3 className="text-sm font-bold text-stone-900">No resellers found</h3>
                                                <p className="text-xs text-stone-400">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                                            {row.getVisibleCells().map(cell => (
                                                <td
                                                    key={cell.id}
                                                    className={`py-4 pr-6 
                                                        ${cell.column.id === 'city' ? 'hidden sm:table-cell' : ''}
                                                        ${cell.column.id === 'approved_at' ? 'hidden md:table-cell' : ''}
                                                        ${cell.column.id === 'actions' ? 'text-right pr-4 sm:pr-0' : ''}
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
                    <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                        <span className="text-xs text-stone-400 font-medium">
                            Showing {result.resellers.length} of {result.pagination.total} resellers
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                            </button>
                            {pageNumbers.map((n, i) =>
                                n === 'ellipsis' ? (
                                    <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-stone-400">…</span>
                                ) : (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setPage(n)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${currentPage === n
                                            ? 'bg-stone-900 text-white shadow-sm'
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
                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
