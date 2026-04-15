import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { TableSkeleton } from '@/components/loading/SkeletonLoaders';
import { useInventory } from '../hooks/use-inventory';
import { adjustInventory } from '../api';
import type { InventoryItem, InventoryFilters } from '../types';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Add01Icon,
    Search01Icon,
    ArrowDown01Icon,
    Upload06Icon,
    FilterMailIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    MoreHorizontalIcon,
    PackageIcon,
    ChartAverageIcon,
    Audit01Icon,
    RankingIcon,
    CourseIcon
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const adjustSchema = z.object({
  type: z.enum(['INCREMENT', 'DECREMENT', 'SET']),
  quantity: z.number().min(0, 'Quantity is required'),
  reason: z.string().optional(),
});

type AdjustFormValues = z.infer<typeof adjustSchema>;

const columnHelper = createColumnHelper<InventoryItem>();

export default function InventoryPage() {
    const queryClient = useQueryClient();
    
    
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [exportOpen, setExportOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null);
    const [activeTab, setActiveTab] = useState('Product Inventory');

    const filters: InventoryFilters = {
        per_page: 15,
        page,
        search: search || undefined,
    };

    const { data, isLoading, isError } = useInventory(filters);
    const result = data?.success ? data.data : null;
    const totalPages = result?.pagination.last_page ?? 1;
    const currentPage = result?.pagination.current_page ?? page;

    // Adjust Stock Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AdjustFormValues>({
        resolver: zodResolver(adjustSchema),
        defaultValues: {
            type: 'INCREMENT',
            quantity: 0,
            reason: '',
        },
    });

    const mutation = useMutation({
        mutationFn: (values: AdjustFormValues) => {
            if (!adjustTarget) {
                return Promise.reject(new Error('No target selected'));
            }
            return adjustInventory({
                variant_id: adjustTarget.variant_id,
                warehouse_id: adjustTarget.warehouse_id,
                quantity: values.quantity,
                type: values.type,
                reason: values.reason ?? undefined,
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['inventory'] });
            setAdjustTarget(null);
            reset();
        },
    });

    const openAdjustModal = (item: InventoryItem): void => {
        setAdjustTarget(item);
        reset({ type: 'INCREMENT', quantity: 0, reason: '' });
        mutation.reset();
    };

    const closeAdjustModal = (): void => {
        setAdjustTarget(null);
        reset();
        mutation.reset();
    };

    const onAdjustSubmit = (values: AdjustFormValues): void => {
        mutation.mutate(values);
    };

    const handleExport = (format: 'pdf' | 'docx' | 'svg' | 'html') => {
        console.log(`Exporting as ${format}`);
    };

    const columns = [
        columnHelper.accessor('variant.sku', {
            id: 'sku',
            header: 'SKU',
            cell: (info) => <span className="text-sm text-stone-500 font-mono">{info.getValue() || '—'}</span>,
        }),
        columnHelper.accessor('variant.name', {
            id: 'product_name',
            header: () => (
                <div className="flex items-center gap-1">
                    Product Name
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </div>
            ),
            cell: (info) => {
                const item = info.row.original;
                const primaryImage = item.variant?.product?.media?.find((m) => m.is_primary)?.url ?? item.variant?.product?.media?.[0]?.url;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-stone-100 flex items-center justify-center shrink-0 border border-stone-100">
                           {primaryImage ? (
                               <img src={primaryImage} alt={item.variant?.name} className="w-full h-full object-cover" />
                           ) : (
                               <HugeiconsIcon icon={PackageIcon} size={16} className="text-stone-400" />
                           )}
                        </div>
                        <p className="text-sm text-stone-800 font-medium truncate max-w-[240px]">{info.getValue() || '—'}</p>
                    </div>
                );
            },
        }),
        columnHelper.display({
            id: 'variant_available',
            header: 'Variant Available',
            cell: () => <span className="text-sm text-stone-500">1</span>, // Placeholder or calculate from variants count
        }),
        columnHelper.display({
            id: 'collection',
            header: 'Collection Category',
            cell: () => <span className="text-sm text-stone-500">Men</span>, // Placeholder or fetch from product
        }),
        columnHelper.accessor('quantity_on_hand', {
            id: 'available',
            header: 'Available',
            cell: (info) => <span className="text-sm text-stone-800 font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('quantity_reserved', {
            id: 'reserved',
            header: 'Reserved',
            cell: (info) => <span className="text-sm text-stone-500">{info.getValue()}</span>,
        }),
        columnHelper.accessor('quantity_damaged', {
            id: 'damaged',
            header: 'Damaged',
            cell: (info) => <span className="text-sm text-stone-500">{info.getValue()}</span>,
        }),
        columnHelper.accessor('reorder_point', {
            id: 'reorder_level',
            header: 'Reorder Level',
            cell: (info) => <span className="text-sm text-stone-500">{info.getValue()}</span>,
        }),
        columnHelper.display({
            id: 'status',
            header: 'Status',
            cell: (info) => {
                const item = info.row.original;
                let statusLabel = 'On Stock';
                let statusClass = 'bg-blue-50 text-blue-600';
                
                if (item.quantity_on_hand <= 0) {
                    statusLabel = 'Out Of Stock';
                    statusClass = 'bg-red-50 text-red-500';
                } else if (item.quantity_on_hand <= item.reorder_point * 0.5) {
                    statusLabel = 'Critical';
                    statusClass = 'bg-pink-50 text-pink-500';
                } else if (item.quantity_on_hand <= item.reorder_point) {
                    statusLabel = 'Low Stock';
                    statusClass = 'bg-orange-50 text-orange-500';
                }
                
                return (
                    <span className={cn("px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap", statusClass)}>
                        {statusLabel}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Action</div>,
            cell: (info) => {
                const item = info.row.original;
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
                                <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem className="text-sm text-stone-700 cursor-pointer" onClick={() => openAdjustModal(item)}>
                                    Adjust Stock
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: result?.inventory ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

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
        { label: 'Overview', icon: Audit01Icon },
        { label: 'Product Inventory', icon: PackageIcon },
        { label: 'Inventory Movement', icon: CourseIcon },
        { label: 'Inventory Allocation', icon: RankingIcon },
        { label: 'Reorder Monitoring', icon: ChartAverageIcon },
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
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">My Inventory</h1>

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
                    <Button 
                        variant="default" 
                        size="sm" 
                        className="flex items-center gap-1.5 bg-stone-900 text-white hover:bg-stone-700 h-8"
                        onClick={() => console.log('Replenish')}
                    >
                        <span className="hidden sm:inline">Replenish</span>
                        <HugeiconsIcon icon={Add01Icon} size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-stone-200 text-stone-600 h-8">
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
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Product')}>By Product</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Warehouse')}>By Warehouse</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tabs Row */}
            <div className="flex items-center gap-4 text-xs font-bold border-b border-stone-100 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                {TABS.map((tab) => (
                    <button
                        key={tab.label}
                        type="button"
                        onClick={() => setActiveTab(tab.label)}
                        className={cn(
                            'pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-max outline-none',
                            activeTab === tab.label ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                        )}
                    >
                        <HugeiconsIcon icon={tab.icon} size={12} />
                        {tab.label}
                        {result && activeTab === tab.label && (
                            <span className="ml-1 text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                {result.pagination.total ?? 0}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Loading / Error States */}
            {isLoading && <TableSkeleton rows={15} columns={8} />}

            {isError && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to load inventory. Please try again.
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
                                                className={`pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6 
                                                    ${header.id === 'sku' ? 'pl-4 sm:pl-0' : ''}
                                                    ${['variant_available', 'collection', 'reserved', 'damaged', 'reorder_level'].includes(header.id) ? 'hidden sm:table-cell' : ''}
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
                                            No inventory records found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td
                                                    key={cell.id}
                                                    className={`py-3.5 pr-6 
                                                        ${['variant_available', 'collection', 'reserved', 'damaged', 'reorder_level'].includes(cell.column.id) ? 'hidden sm:table-cell' : ''}
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

            {/* Adjust Stock Modal */}
            {adjustTarget !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={(e) => e.target === e.currentTarget && closeAdjustModal()}
                >
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                            <h2 className="text-base font-bold text-stone-900">Adjust Stock</h2>
                            <p className="text-xs text-stone-500 mt-0.5">
                                {adjustTarget.variant?.name ?? 'Unknown Variant'}
                                {' — '}
                                {adjustTarget.warehouse?.name ?? 'Unknown Warehouse'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onAdjustSubmit)} noValidate>
                            <div className="p-6 space-y-4">
                                {mutation.isError && (
                                    <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                                        Failed to adjust stock. Please try again.
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="adjust-type" className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                                        Adjustment Type
                                    </label>
                                    <select
                                        id="adjust-type"
                                        {...register('type')}
                                        className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
                                    >
                                        <option value="INCREMENT">Increment (+)</option>
                                        <option value="DECREMENT">Decrement (-)</option>
                                        <option value="SET">Set Fixed Amount (=)</option>
                                    </select>
                                    {errors.type && (
                                        <p className="mt-1.5 text-xs text-red-600">{errors.type.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="adjust-quantity" className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                                        Quantity
                                    </label>
                                    <Input
                                        id="adjust-quantity"
                                        type="number"
                                        min={0}
                                        {...register('quantity', { valueAsNumber: true })}
                                        className="border-stone-200 focus-visible:ring-stone-400"
                                    />
                                    {errors.quantity && (
                                        <p className="mt-1.5 text-xs text-red-600">{String(errors.quantity.message)}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="adjust-reason" className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                                        Reason <span className="text-stone-400 font-normal normal-case">(optional)</span>
                                    </label>
                                    <Input
                                        id="adjust-reason"
                                        type="text"
                                        placeholder="e.g. Damaged inventory, Stock count"
                                        {...register('reason')}
                                        className="border-stone-200 focus-visible:ring-stone-400"
                                    />
                                    {errors.reason && (
                                        <p className="mt-1.5 text-xs text-red-600">{errors.reason.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/30 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeAdjustModal}
                                    className="border-stone-200 text-stone-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="bg-stone-900 text-white hover:bg-stone-800"
                                >
                                    {mutation.isPending ? 'Saving...' : 'Confirm'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
