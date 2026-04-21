import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    type RowSelectionState,
} from '@tanstack/react-table';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Building04Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface ReorderItem {
    id: string;
    sku: string;
    currentStock: number;
    reorderLevel: number;
    suggestedOrderQty: number;
    supplier: {
        name: string;
        logoIcon?: any;
    };
}

const mockData: ReorderItem[] = [
    {
        id: '1',
        sku: 'DOM-50',
        currentStock: 80,
        reorderLevel: 100,
        suggestedOrderQty: 300,
        supplier: {
            name: 'Main Supplier PH',
        },
    },
    {
        id: '2',
        sku: 'DOM-51',
        currentStock: 75,
        reorderLevel: 95,
        suggestedOrderQty: 290,
        supplier: {
            name: 'Secondary Supplier PH',
        },
    },
    {
        id: '3',
        sku: 'DOM-52',
        currentStock: 85,
        reorderLevel: 110,
        suggestedOrderQty: 310,
        supplier: {
            name: 'Main Supplier PH',
        },
    },
    {
        id: '4',
        sku: 'DOM-53',
        currentStock: 90,
        reorderLevel: 120,
        suggestedOrderQty: 320,
        supplier: {
            name: 'Main Supplier PH',
        },
    },
    {
        id: '5',
        sku: 'DOM-54',
        currentStock: 70,
        reorderLevel: 105,
        suggestedOrderQty: 280,
        supplier: {
            name: 'Main Supplier PH',
        },
    },
];

const columnHelper = createColumnHelper<ReorderItem>();

export default function ReorderPage() {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [page, setPage] = useState(1);
    const data = useMemo(() => mockData, []);

    const columns = [
        columnHelper.display({
            id: 'select',
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="border-[#E5E7EB] data-[state=checked]:bg-[#1C1C1C] data-[state=checked]:border-[#1C1C1C]"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="border-[#E5E7EB] data-[state=checked]:bg-[#1C1C1C] data-[state=checked]:border-[#1C1C1C]"
                    />
                </div>
            ),
        }),
        columnHelper.accessor('sku', {
            header: 'SKU',
            cell: (info) => <span className="text-[#393939] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor('currentStock', {
            header: 'Current Stock',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('reorderLevel', {
            header: 'Reorder Level',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('suggestedOrderQty', {
            header: 'Suggested Order Qty',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('supplier', {
            header: 'Supplier',
            cell: (info) => {
                const supplier = info.getValue();
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-[#1C1C1C] flex items-center justify-center shrink-0">
                            <HugeiconsIcon icon={Building04Icon} size={12} className="text-white" />
                        </div>
                        <span className="text-[13px] font-bold text-[#A5A5A5]">
                            {supplier.name}
                        </span>
                    </div>
                );
            },
        }),
    ];


    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
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
                                <tr 
                                    key={row.id} 
                                    className={cn(
                                        "hover:bg-gray-50/50 transition-colors",
                                        row.getIsSelected() && "bg-gray-50/80"
                                    )}
                                >
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
            <div className="flex items-center justify-between px-2 pb-6">
                <p className="text-[12px] text-[#A5A5A5] font-medium">Page {page} of 1</p>
                <div className="flex items-center gap-2">
                    <button 
                        disabled 
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#A5A5A5] hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                    </button>
                    {[1].map((n) => (
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
                    <button 
                        disabled 
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#A5A5A5] hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

