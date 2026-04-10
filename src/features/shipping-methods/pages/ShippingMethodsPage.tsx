    import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Add01Icon, Edit02Icon, Delete01Icon, Search01Icon, FilterMailIcon, ArrowRight01Icon, ArrowLeft01Icon, Location01Icon, GlobalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { useShippingMethods, useDeleteShippingMethod } from '../hooks/use-shipping-methods';
import { ShippingMethodModal } from '../components/ShippingMethodModal';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import type { ShippingMethod } from '../types';

const columnHelper = createColumnHelper<ShippingMethod>();

export function ShippingMethodsPage() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

    const { data: shippingMethods, isLoading, error } = useShippingMethods();
    const deleteMutation = useDeleteShippingMethod();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const handleCreate = () => {
        setSelectedMethod(null);
        setIsModalOpen(true);
    };

    const handleEdit = (method: ShippingMethod) => {
        setSelectedMethod(method);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this shipping method?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: () => (
                <div className="flex items-center gap-1">
                    Name
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </div>
            ),
            cell: (info) => (
                <div className="flex items-center">
                    <p className="text-sm text-stone-800 font-medium truncate max-w-60">{info.getValue()}</p>
                </div>
            ),
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: (info) => (
                <span className="text-sm text-stone-500 max-w-50 truncate block">
                    {info.getValue() || '—'}
                </span>
            ),
        }),
        columnHelper.accessor('base_fee', {
            header: 'Base Fee (₱)',
            cell: (info) => (
                <span className="text-sm text-stone-800 font-medium">
                    ₱{Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </span>
            ),
        }),
        columnHelper.accessor('is_active', {
            header: 'Status',
            cell: (info) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${info.getValue() ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                    {info.getValue() ? 'Active' : 'Inactive'}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Action</div>,
            cell: (info) => (
                <div className="flex justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-stone-500 hover:text-stone-900 hover:bg-stone-100/50"
                        onClick={() => handleEdit(info.row.original)}
                    >
                        <HugeiconsIcon icon={Edit02Icon} size={15} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(info.row.original.id)}
                        disabled={deleteMutation.isPending}
                    >
                        <HugeiconsIcon icon={Delete01Icon} size={15} />
                    </Button>
                </div>
            ),
        }),
    ], [deleteMutation.isPending]);

    const filteredMethods = useMemo(() => {
        return shippingMethods?.filter(method => 
            method.name.toLowerCase().includes(search.toLowerCase()) || 
            (method.description && method.description.toLowerCase().includes(search.toLowerCase()))
        ) ?? [];
    }, [shippingMethods, search]);

    const itemsPerPage = 15;
    const totalPages = Math.max(1, Math.ceil(filteredMethods.length / itemsPerPage));
    const currentPage = page;

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

    const paginatedMethods = useMemo(() => {
        return filteredMethods.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    }, [filteredMethods, page]);

    const table = useReactTable({
        data: paginatedMethods,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const TABS = [
        { label: 'Shipping Methods', to: '/shipping-methods', icon: GlobalIcon },
        { label: 'Zones / Regions', to: '/shipping-methods', icon: Location01Icon },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-h-full bg-white">

            {/* Date */}
            <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-stone-400">{today}</p>
            </div>

            {/* Page Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Shipping Methods</h1>

            {/* Search + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1 sm:max-w-sm">
                    <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400 h-8 text-sm"
                    />
                </div>

                <div className="hidden md:flex items-center text-xs text-stone-400 shrink-0">
                    Last Updated: {lastUpdated}
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <Button
                        onClick={handleCreate}
                        className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
                    >
                        <span className="hidden sm:inline">Add Method</span>
                        <HugeiconsIcon icon={Add01Icon} size={14} />
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
                        <DropdownMenuContent align="end" side="bottom" className="min-w-0">
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Active')}>Active</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Base Fee')}>Base Fee</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tabs Row */}
            <div className="flex items-center gap-4 text-xs font-bold border-b border-stone-100 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                {TABS.map((tab) => (
                    <div
                        key={tab.label}
                        className={cn(
                            'pb-2 flex items-center gap-1.5 whitespace-nowrap min-w-max transition-colors cursor-pointer',
                            tab.label === 'Shipping Methods' ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                        )}
                    >
                        <HugeiconsIcon icon={tab.icon} size={12} />
                        {tab.label}
                        {shippingMethods && tab.label === 'Shipping Methods' && (
                            <span className="ml-1 text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                {shippingMethods.length}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="py-16 text-center text-sm text-stone-400">
                    Loading methods...
                </div>
            )}

            {/* Error */}
            {error && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to load shipping methods. Please try again.
                </div>
            )}

            {/* Table */}
            {shippingMethods && (
                <>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-[800px] w-full text-sm">
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="border-b border-stone-100">
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className={`pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6 
                                                    ${header.id === 'name' ? 'pl-4 sm:pl-0' : ''}
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
                                        <td colSpan={columns.length} className="py-16 text-center text-stone-400">
                                            No methods found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td
                                                    key={cell.id}
                                                    className={`py-3.5 pr-6 
                                                        ${cell.column.id === 'name' ? 'pl-4 sm:pl-0' : ''}
                                                        ${cell.column.id === 'actions' ? 'pr-4 sm:pr-0' : ''}
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
                                    <span key={`e-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-stone-400">...</span>
                                ) : (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setPage(n)}
                                        className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${currentPage === n
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

            <ShippingMethodModal 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen} 
                method={selectedMethod} 
            />
        </div>
    );
}
