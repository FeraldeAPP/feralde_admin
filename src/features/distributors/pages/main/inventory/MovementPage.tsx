import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    MoreHorizontalIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    CpuIcon,
    Building04Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MovementItem {
    id: string;
    date: string;
    sku: string;
    type: 'Stock In' | 'Stock Out' | 'Damage' | 'Return';
    reference: string;
    quantity: number;
    before: number;
    after: number;
    processedBy: {
        name: string;
        avatar?: string;
        type: 'Staff' | 'System' | 'Warehouse';
    };
}

const mockData: MovementItem[] = [
    {
        id: '1',
        date: 'Feb 24',
        sku: 'LME-50',
        type: 'Stock In',
        reference: 'PO-1021',
        quantity: 500,
        before: 120,
        after: 620,
        processedBy: {
            name: 'Emilio Aguina...',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
            type: 'Staff',
        },
    },
    {
        id: '2',
        date: 'Feb 24',
        sku: 'LME-50',
        type: 'Stock Out',
        reference: 'DO-2045',
        quantity: -70,
        before: 620,
        after: 550,
        processedBy: {
            name: 'System',
            type: 'System',
        },
    },
    {
        id: '3',
        date: 'Feb 24',
        sku: 'LME-50',
        type: 'Stock Out',
        reference: 'SO-1012',
        quantity: -1,
        before: 81,
        after: 80,
        processedBy: {
            name: 'System',
            type: 'System',
        },
    },
    {
        id: '4',
        date: 'Feb 24',
        sku: 'LME-50',
        type: 'Damage',
        reference: 'ADJ-09',
        quantity: -2,
        before: 412,
        after: 410,
        processedBy: {
            name: 'Warehouse',
            type: 'Warehouse',
        },
    },
    {
        id: '5',
        date: 'Feb 23',
        sku: 'LME-51',
        type: 'Stock In',
        reference: 'PO-1022',
        quantity: 200,
        before: 50,
        after: 250,
        processedBy: {
            name: 'Emilio Aguina...',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
            type: 'Staff',
        },
    },
    {
        id: '6',
        date: 'Feb 23',
        sku: 'LME-51',
        type: 'Stock Out',
        reference: 'DO-2046',
        quantity: -50,
        before: 250,
        after: 200,
        processedBy: {
            name: 'System',
            type: 'System',
        },
    },
];

const columnHelper = createColumnHelper<MovementItem>();

export default function MovementPage() {
    const [page, setPage] = useState(1);
    const data = useMemo(() => mockData, []);

    const columns = [
        columnHelper.accessor('date', {
            header: 'Date',
            cell: (info) => <span className="text-[#A5A5A5] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('sku', {
            header: 'SKU',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('type', {
            header: 'Type',
            cell: (info) => <span className="text-[#A5A5A5] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('reference', {
            header: 'Reference',
            cell: (info) => <span className="text-[#A5A5A5] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('quantity', {
            header: 'Quantity',
            cell: (info) => {
                const val = info.getValue();
                const isPositive = val > 0;
                return (
                    <span className={cn(
                        "font-bold",
                        isPositive ? "text-[#0F973D]" : "text-[#D42620]"
                    )}>
                        {isPositive ? `+${val}` : val}
                    </span>
                );
            },
        }),
        columnHelper.accessor('before', {
            header: 'Before',
            cell: (info) => <span className="text-[#A5A5A5] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('after', {
            header: 'After',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('processedBy', {
            header: 'Processed By',
            cell: (info) => {
                const { name, avatar, type } = info.getValue();
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md overflow-hidden bg-[#1C1C1C] flex items-center justify-center shrink-0">
                            {avatar ? (
                                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                            ) : type === 'System' ? (
                                <HugeiconsIcon icon={CpuIcon} size={14} className="text-white" />
                            ) : (
                                <HugeiconsIcon icon={Building04Icon} size={14} className="text-white" />
                            )}
                        </div>
                        <span className="text-[13px] font-bold text-[#1C1C1C] truncate max-w-[120px]">
                            {name}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Action',
            cell: () => (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <HugeiconsIcon icon={MoreHorizontalIcon} size={18} className="text-[#A5A5A5] hover:text-[#393939] transition-colors" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-[#F2F2F2] rounded-xl shadow-lg">
                            <DropdownMenuItem className="text-[12px] cursor-pointer">View Reference</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] cursor-pointer">Download Log</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-[#F2F2F2]">
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-6 py-4 text-[11px] font-bold text-[#A5A5A5] uppercase tracking-wider">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-[#F2F2F2]">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-[13px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <p className="text-[12px] text-[#A5A5A5] font-medium">Page 1 of 4</p>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#A5A5A5] hover:bg-gray-50 disabled:opacity-50 transition-colors">
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                    </button>
                    {[1, 2, 3, 4].map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={cn(
                                "w-8 h-8 text-[12px] font-bold rounded-lg transition-colors",
                                page === n ? "bg-[#1C1C1C] text-white" : "text-[#A5A5A5] hover:bg-gray-50"
                            )}
                        >
                            {n}
                        </button>
                    ))}
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#A5A5A5] hover:bg-gray-50 transition-colors">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
