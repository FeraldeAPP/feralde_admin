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
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AllocationItem {
    id: string;
    sku: string;
    available: number;
    reserved: number;
    allocations: {
        name: string;
        count: number;
        avatar: string;
    }[];
}

const mockData: AllocationItem[] = [
    {
        id: '1',
        sku: 'LME-50',
        available: 320,
        reserved: 45,
        allocations: [
            { name: 'Maria Santos', count: 30, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
            { name: 'Miguel Tan', count: 15, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
        ],
    },
    {
        id: '2',
        sku: 'LME-51',
        available: 450,
        reserved: 60,
        allocations: [
            { name: 'John Doe', count: 40, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
            { name: 'Jane Smith', count: 20, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
        ],
    },
    {
        id: '3',
        sku: 'LME-52',
        available: 600,
        reserved: 75,
        allocations: [
            { name: 'Alice Johnson', count: 35, avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=100' },
            { name: 'Bob Brown', count: 25, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
        ],
    },
    {
        id: '4',
        sku: 'LME-53',
        available: 700,
        reserved: 90,
        allocations: [
            { name: 'Chris Lee', count: 50, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
            { name: 'Emma Wilson', count: 10, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' },
        ],
    },
];

const columnHelper = createColumnHelper<AllocationItem>();

export default function AllocationPage() {
    const [page, setPage] = useState(1);
    const data = useMemo(() => mockData, []);

    const columns = [
        columnHelper.accessor('sku', {
            header: 'SKU',
            cell: (info) => <span className="text-[#A5A5A5] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('available', {
            header: 'Available',
            cell: (info) => <span className="text-[#393939] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor('reserved', {
            header: 'Reserved',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('allocations', {
            header: 'Allocated To',
            cell: (info) => {
                const allocations = info.getValue();
                return (
                    <div className="flex items-center gap-2">
                        {allocations.map((alloc, idx) => (
                            <div key={idx} className="flex items-center gap-2 mr-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#F2F2F2]">
                                    <img src={alloc.avatar} alt={alloc.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[13px] font-bold text-[#393939] whitespace-nowrap">
                                    {alloc.name} ({alloc.count}){idx < allocations.length - 1 ? ',' : ''}
                                </span>
                            </div>
                        ))}
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
                            <DropdownMenuItem className="text-[12px] cursor-pointer">Edit Allocation</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] cursor-pointer">View History</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] cursor-pointer text-red-500">Remove Allocation</DropdownMenuItem>
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
