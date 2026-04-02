import { getOrders } from '@/features/orders/api';
import type { Order, OrderStatus } from '@/features/orders/types';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Add01Icon,
    Search01Icon,
    ArrowDown01Icon,
    Upload06Icon,
    FilterMailIcon,
    MoreHorizontalIcon,
    ListViewIcon,
    KanbanIcon,
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
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
} from '@/components/reui/kanban';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const STATUS_COLORS: Record<string, { text: string; bg: string; dot: string; label: string }> = {
    NEW: { text: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-500', label: 'Order Place' },
    PREPARING: { text: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-500', label: 'Preparing' },
    PACKED: { text: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500', label: 'Ready to Pick Up' },
    LOGISTICS: { text: 'text-purple-600', bg: 'bg-purple-50', dot: 'bg-purple-500', label: 'For Fulfillment' },
};

const KANBAN_COLUMNS = [
    { id: 'NEW', label: 'New Orders', statuses: ['PENDING'] },
    { id: 'PREPARING', label: 'Preparing', statuses: ['CONFIRMED', 'PROCESSING'] },
    { id: 'PACKED', label: 'Packed', statuses: [] },
    { id: 'LOGISTICS', label: 'Logistics', statuses: ['SHIPPED'] },
];

export default function OrdersPage(): React.ReactElement {
    const { hasPermission } = useAuth();
    const [page] = useState(1);
    const [status] = useState<OrderStatus | ''>('');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
    const [activeTab, setActiveTab] = useState<'shop' | 'distributor'>('distributor');
    const [search, setSearch] = useState('');
    const [exportOpen, setExportOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['orders', page, status],
        queryFn: () => getOrders({ page, per_page: 50, ...(status ? { status } : {}) }),
    });

    const canCreate = hasPermission('orders.create');
    const result = data?.success ? data.data : null;
    const orders = result?.orders ?? [];

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

    const handleExport = (format: string) => console.log(`Exporting as ${format}`);

    const kanbanData = useMemo(() => {
        const columns: Record<string, Order[]> = {
            NEW: [],
            PREPARING: [],
            PACKED: [],
            LOGISTICS: [],
        };

        orders.forEach(order => {
            if (order.status === 'PENDING') columns.NEW.push(order);
            else if (order.status === 'CONFIRMED' || order.status === 'PROCESSING') columns.PREPARING.push(order);
            else if (order.status === 'SHIPPED') columns.LOGISTICS.push(order);
            // Default to PREPARING if not matched for now
            else columns.PREPARING.push(order);
        });

        return columns;
    }, [orders]);


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
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Orders</h1>

            {/* Search + Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1 sm:max-w-sm">
                    <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <div className="flex items-center">
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-10 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400 h-9"
                        />
                        <button className="absolute right-0 top-0 bottom-0 px-3 cursor-pointer">
                            <HugeiconsIcon icon={Search01Icon} size={14} className="text-stone-400" />
                        </button>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6 ml-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-stone-400">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("flex items-center gap-1.5 transition-colors", viewMode === 'list' ? "text-stone-900" : "hover:text-stone-600")}
                        >
                            <HugeiconsIcon icon={ListViewIcon} size={14} />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn("flex items-center gap-1.5 transition-colors relative py-1", viewMode === 'kanban' ? "text-stone-900" : "hover:text-stone-600")}
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
                    {canCreate && (
                        <Link
                            to="/orders"
                            className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
                        >
                            <span>Add Order</span>
                            <HugeiconsIcon icon={Add01Icon} size={14} />
                        </Link>
                    )}
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

            {/* Tabs Row */}
            <div className="flex items-center gap-4 text-xs font-bold border-b border-stone-100">
                <button
                    onClick={() => setActiveTab('shop')}
                    className={cn(
                        "pb-2 transition-colors",
                        activeTab === 'shop' ? "text-stone-900 border-b-2 border-stone-900" : "text-stone-400 hover:text-stone-600"
                    )}
                >
                    Shop Orders
                </button>
                <button
                    onClick={() => setActiveTab('distributor')}
                    className={cn(
                        "pb-2 transition-colors",
                        activeTab === 'distributor' ? "text-stone-900 border-b-2 border-stone-900" : "text-stone-400 hover:text-stone-600"
                    )}
                >
                    Distributor Orders
                </button>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="py-20 text-center text-stone-400 text-sm">Loading orders...</div>
            ) : isError ? (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to load orders.
                </div>
            ) : viewMode === 'list' ? (
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-stone-100 text-sm">
                            <thead>
                                <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                                    <th className="px-5 py-3 text-left">Order Number</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Payment</th>
                                    <th className="px-5 py-3 text-right">Total</th>
                                    <th className="px-5 py-3 text-left">Date</th>
                                    <th className="px-5 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                        <td className="px-5 py-4 font-mono font-medium text-stone-900 text-xs">
                                            {order.order_number}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex text-[10px] px-2 py-0.5 rounded-md font-bold bg-green-50 text-green-600 border border-green-100">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex text-[10px] px-2 py-0.5 rounded-md font-bold bg-stone-50 text-stone-600 border border-stone-100">
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right font-medium text-stone-900 text-xs">
                                            ₱{parseFloat(order.total_amount).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 text-stone-400 text-[10px] font-medium whitespace-nowrap uppercase">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <Link to="/orders/$id" params={{ id: String(order.id) }} className="text-[10px] font-bold text-stone-900 hover:underline">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <Kanban
                    value={kanbanData}
                    onValueChange={() => { }}
                    getItemValue={(item) => String(item.id)}
                >
                    <KanbanBoard className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                        {KANBAN_COLUMNS.map((col) => {
                            const config = STATUS_COLORS[col.id];
                            return (
                                <KanbanColumn key={col.id} value={col.id} className="min-w-0">
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
                                                <span className="text-xs font-bold text-stone-500">{col.label}</span>
                                                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 rounded">
                                                    {kanbanData[col.id].length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <HugeiconsIcon icon={MoreHorizontalIcon} size={14} className="text-stone-300" />
                                            <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-stone-300" />
                                        </div>
                                    </div>
                                    <KanbanColumnContent value={col.id} className="flex flex-col gap-3">
                                        {kanbanData[col.id].map((order) => (
                                            <KanbanCard key={order.id} order={order} config={config} />
                                        ))}
                                        {kanbanData[col.id].length === 0 && (
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
    return (
        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-start justify-between mb-3">
                <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-1">Emily White</h3>
                    <p className="text-[10px] font-medium text-stone-400 uppercase tracking-tight">{order.order_number}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-stone-400 whitespace-nowrap uppercase">Nov 16, 2025</span>
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="text-green-500" />
                    </div>
                </div>
            </div>

            <div className="h-px bg-stone-100 border-dashed border-stone-100 w-full mb-3" />

            <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-stone-300 uppercase">Order Status</span>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            {/* Placeholder avatar */}
                        </div>
                        <span className="text-[10px] font-bold text-stone-400">2 items</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={cn("text-[10px] font-bold px-4 py-1.5 rounded-lg border", config.bg, config.text, "border-opacity-10")}>
                        {config.label}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[#0055FF] flex items-center justify-center shrink-0">
                        {/* Placeholder generic payment icon */}
                        <div className="text-[8px] text-white font-bold">GC</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


