import { Link, useNavigate } from '@tanstack/react-router';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Order, OrderStatus } from '@/features/orders/types';
import { useUpdateOrderStatus } from '@/features/orders/hooks/use-orders';
import { useMyOrders } from '@/features/distributors/hooks/use-distributors';
import {
    Add01Icon,
    Search01Icon,
    ArrowDown01Icon,
    Upload06Icon,
    FilterMailIcon,
    MoreHorizontalIcon,
    ListViewIcon,
    KanbanIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    UserIcon,
    Store02Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
    KanbanItem,
    KanbanItemHandle,
} from '@/components/reui/kanban';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';

const columnHelper = createColumnHelper<Order>();

const STATUS_COLORS: Record<string, { text: string; bg: string; dot: string; label: string }> = {
    PENDING: { text: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500', label: 'Pending' },
    CONFIRMED: { text: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500', label: 'Confirmed' },
    PROCESSING: { text: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500', label: 'Processing' },
    SHIPPED: { text: 'text-purple-600', bg: 'bg-purple-50', dot: 'bg-purple-500', label: 'Shipped' },
};

const KANBAN_COLUMNS = [
    { id: 'PENDING', label: 'Pending' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'PROCESSING', label: 'Processing' },
    { id: 'SHIPPED', label: 'Shipped' },
];

const STATUS_MAP: Record<string, OrderStatus> = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
};

/** Get the Kanban column key for a given order status */
function getKanbanColumn(status: OrderStatus): string {
    if (status === 'PACKED') return 'PROCESSING';
    return status;
}

function getOrderDisplayName(order: Order): string {
    if (order.billing_address) {
        return `${order.billing_address.first_name} ${order.billing_address.last_name}`;
    }
    if (order.customer_name) {
        return order.customer_name;
    }
    if (order.guest_email) {
        return order.guest_email;
    }
    if (order.customer_id) {
        return `Customer #${order.customer_id.slice(-6)}`;
    }
    return 'Reseller Order';
}

export default function OrdersPage(): React.ReactElement {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [status] = useState<OrderStatus | ''>('');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
    const [search, setSearch] = useState('');
    const [exportOpen, setExportOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const { data, isLoading, isError } = useMyOrders({
        page,
        per_page: 50,
        status: status || undefined,
        search: search || undefined,
    });

    const result = data?.success ? data.data : null;
    const orders = result?.orders ?? [];
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
        columnHelper.accessor('order_number', {
            header: 'Order Number',
            cell: (info) => (
                <span className="font-mono font-medium text-stone-900 text-xs">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'customer_or_reseller',
            header: 'Customer / Reseller',
            cell: (info) => {
                const order = info.row.original;
                const name = getOrderDisplayName(order);
                const Icon = order.reseller_id ? Store02Icon : UserIcon;
                return (
                    <div className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Icon} size={12} className="text-stone-400 shrink-0" />
                        <span className="text-xs text-stone-700 font-medium truncate max-w-[140px]">{name}</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => {
                const s = info.getValue();
                let config = STATUS_COLORS[s] || STATUS_COLORS.PENDING;

                return (
                    <span className={cn('inline-flex text-[10px] px-2 py-0.5 rounded-md font-bold border', config.bg, config.text, 'border-stone-100')}>
                        {s}
                    </span>
                );
            },
        }),
        columnHelper.accessor('payment_status', {
            header: 'Payment',
            cell: (info) => (
                <span className="inline-flex text-[10px] px-2 py-0.5 rounded-md font-bold bg-stone-50 text-stone-600 border border-stone-100">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('total_amount', {
            header: () => <div className="text-right">Total</div>,
            cell: (info) => (
                <div className="text-right font-medium text-stone-900 text-xs">
                    ₱{parseFloat(info.getValue()).toLocaleString()}
                </div>
            ),
        }),
        columnHelper.accessor('created_at', {
            header: 'Date',
            cell: (info) => (
                <span className="text-stone-400 text-[10px] font-medium whitespace-nowrap uppercase">
                    {new Date(info.getValue()).toLocaleDateString()}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-center">Action</div>,
            cell: (info) => (
                <div className="text-center">
                    <Link to="/orders/$id" params={{ id: String(info.row.original.id) }} className="text-[10px] font-bold text-stone-900 hover:underline">
                        View
                    </Link>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const [localKanbanData, setLocalKanbanData] = useState<Record<string, Order[]>>({
        PENDING: [],
        CONFIRMED: [],
        PROCESSING: [],
        SHIPPED: [],
    });

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

    const handleExport = (format: string) => console.log(`Exporting as ${format}`);

    const kanbanData = useMemo(() => {
        const cols: Record<string, Order[]> = {
            PENDING: [],
            CONFIRMED: [],
            PROCESSING: [],
            SHIPPED: [],
        };

        orders.forEach(order => {
            const col = getKanbanColumn(order.status);
            if (cols[col]) {
                cols[col].push(order);
            }
        });

        return cols;
    }, [orders]);

    useEffect(() => {
        setLocalKanbanData(kanbanData);
    }, [kanbanData]);

    const updateMutation = useUpdateOrderStatus();

    const handleMove = useCallback((event: any) => {
        const { activeContainer, overContainer, event: dndEvent } = event;

        if (activeContainer !== overContainer) {
            const orderId = dndEvent.active.id;
            const newStatus = STATUS_MAP[overContainer];

            if (newStatus && orderId) {
                updateMutation.mutate({ id: Number(orderId), status: newStatus });
            }
        }
    }, [updateMutation]);

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-screen bg-[#FDFDFD]">
            {/* Header: Date + Export */}
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
            <div>
                <p className="text-[12px] text-[#A5A5A5] font-medium leading-tight">Distributor Portal</p>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Orders Management</h1>
            </div>

            {/* Search + Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1 sm:max-w-sm">
                    <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <div className="flex items-center">
                        <Input
                            placeholder="Search your orders…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-10 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400 h-9"
                        />
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6 ml-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-stone-400">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn('flex items-center gap-1.5 transition-colors', viewMode === 'list' ? 'text-stone-900' : 'hover:text-stone-600')}
                        >
                            <HugeiconsIcon icon={ListViewIcon} size={14} />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn('flex items-center gap-1.5 transition-colors relative py-1', viewMode === 'kanban' ? 'text-stone-900' : 'hover:text-stone-600')}
                        >
                            <HugeiconsIcon icon={KanbanIcon} size={14} />
                            Cards / Kanban
                            {viewMode === 'kanban' && <div className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-sky-500 rounded-full" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                    <div className="hidden xl:flex items-center text-[10px] text-stone-400 shrink-0 ml-auto mr-4">
                        Last Updated: {lastUpdated}
                    </div>
                    <Link
                        to="/distributor/orders/make"
                        className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
                    >
                        <span>Make Order</span>
                        <HugeiconsIcon icon={Add01Icon} size={14} />
                    </Link>
                    <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1.5 border-stone-200 text-stone-600 h-8 font-medium">
                        <span>Import</span>
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
                        <DropdownMenuContent align="end" side="bottom" className="w-29 min-w-0">
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Date')}>By Date</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Amount')}>By Amount</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="py-20 text-center text-stone-400 text-sm">Loading orders…</div>
            ) : isError ? (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to load orders.
                </div>
            ) : viewMode === 'list' ? (
                <div className="space-y-4">
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-full text-sm">
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="border-b border-stone-100">
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className={cn(
                                                    'pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6',
                                                    header.id === 'order_number' && 'pl-4 sm:pl-0'
                                                )}
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
                            <tbody className="divide-y divide-stone-50">
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="py-16 text-center text-stone-400">
                                            No orders found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr 
                                            key={row.id} 
                                            className="border-b border-stone-100 hover:bg-stone-50 transition-colors cursor-pointer group"
                                            onClick={() => navigate({ to: '/orders/$id', params: { id: String(row.original.id) } })}
                                        >
                                            {row.getVisibleCells().map(cell => (
                                                <td
                                                    key={cell.id}
                                                    className="py-3.5 pr-6"
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
                </div>
            ) : (
                <Kanban
                    value={localKanbanData}
                    onValueChange={setLocalKanbanData}
                    getItemValue={(item) => String(item.id)}
                    onMove={handleMove}
                >
                    <KanbanBoard className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-start overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {KANBAN_COLUMNS.map((col) => {
                            const config = STATUS_COLORS[col.id];
                            return (
                                <KanbanColumn key={col.id} value={col.id} className="flex-shrink-0 w-[280px] md:w-auto min-w-0">
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
                                                <span className="text-xs font-bold text-stone-500">{col.label}</span>
                                                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 rounded">
                                                    {localKanbanData[col.id]?.length ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={MoreHorizontalIcon} size={14} className="text-stone-300" />
                                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-stone-300" />
                                        </div>
                                    </div>
                                    <KanbanColumnContent value={col.id} className="flex flex-col gap-3">
                                        {(localKanbanData[col.id] ?? []).map((order) => (
                                            <KanbanItem key={order.id} value={String(order.id)}>
                                                <KanbanCard order={order} config={config} />
                                            </KanbanItem>
                                        ))}
                                        {(localKanbanData[col.id] ?? []).length === 0 && (
                                            <div className="py-10 border-2 border-dashed border-stone-100 rounded-2xl flex items-center justify-center">
                                                <span className="text-stone-300 text-xs font-medium">No orders</span>
                                            </div>
                                        )}
                                    </KanbanColumnContent>
                                </KanbanColumn>
                            );
                        })}
                    </KanbanBoard>
                </Kanban>
            )}
        </div>
    );
}

function KanbanCard({ order, config }: { order: Order; config: any }) {
    const displayName = getOrderDisplayName(order);
    const orderDate = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const itemCount = (order as any).items?.length ?? '—';

    return (
        <KanbanItemHandle>
            <Link to="/orders/$id" params={{ id: String(order.id) }} className="block group outline-none">
                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                    <div className="flex items-start justify-between mb-3">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-stone-600 transition-colors">{displayName}</h3>
                            <p className="text-[10px] font-medium text-stone-400 uppercase tracking-tight">{order.order_number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-stone-400 whitespace-nowrap uppercase">{orderDate}</span>
                            <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                                <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="text-green-500 group-hover:text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-stone-100 border-dashed border-stone-100 w-full mb-3" />

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-stone-300 uppercase">
                                {order.reseller_id ? 'Reseller Order' : 'Customer Order'}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-stone-100 overflow-hidden shrink-0 border border-stone-200 flex items-center justify-center">
                                    <HugeiconsIcon icon={order.reseller_id ? Store02Icon : UserIcon} size={10} className="text-stone-400" />
                                </div>
                                <span className="text-[10px] font-bold text-stone-400">
                                    {itemCount === '—' ? '— items' : `${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={cn('text-[10px] font-bold px-4 py-1.5 rounded-lg border', config.bg, config.text, 'border-opacity-10')}>
                                {config.label}
                            </span>
                            <span className="text-[10px] font-bold text-stone-500">
                                ₱{parseFloat(order.total_amount).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </KanbanItemHandle>
    );
}
