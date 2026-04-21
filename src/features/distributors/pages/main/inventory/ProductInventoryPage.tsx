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

interface InventoryItem {
    sku: string;
    productName: string;
    image: string;
    variantAvailable: number;
    collectionCategory: string;
    available: number;
    reserved: number;
    damaged: number;
    reorderLevel: number;
    status: 'On Stock' | 'Low Stock' | 'Critical' | 'Out Of Stock';
}

const mockData: InventoryItem[] = [
    {
        sku: 'LME-50',
        productName: 'LME – FERALDE PERFUME (Le Male Elixir Inspired)',
        image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 320,
        reserved: 45,
        damaged: 2,
        reorderLevel: 100,
        status: 'On Stock',
    },
    {
        sku: 'LME-51',
        productName: 'LME – CITRUS BLOSSOM',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 80,
        reserved: 50,
        damaged: 1,
        reorderLevel: 150,
        status: 'Low Stock',
    },
    {
        sku: 'LME-52',
        productName: 'LME – WOODLAND MIST',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 300,
        reserved: 55,
        damaged: 3,
        reorderLevel: 120,
        status: 'On Stock',
    },
    {
        sku: 'LME-53',
        productName: 'LME – SPICE NIGHT',
        image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 10,
        reserved: 50,
        damaged: 2,
        reorderLevel: 130,
        status: 'Critical',
    },
    {
        sku: 'LME-54',
        productName: 'LME – OCEAN BREEZE',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 16,
        reserved: 40,
        damaged: 4,
        reorderLevel: 110,
        status: 'Critical',
    },
    {
        sku: 'LME-55',
        productName: 'LME – MOUNTAIN AIR',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 310,
        reserved: 45,
        damaged: 2,
        reorderLevel: 140,
        status: 'On Stock',
    },
    {
        sku: 'LME-56',
        productName: 'LME – AMBER GOLD',
        image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 340,
        reserved: 60,
        damaged: 1,
        reorderLevel: 90,
        status: 'On Stock',
    },
    {
        sku: 'LME-57',
        productName: 'LME – CEDAR WOOD',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 50,
        reserved: 55,
        damaged: 0,
        reorderLevel: 160,
        status: 'Low Stock',
    },
    {
        sku: 'LME-58',
        productName: 'LME – SANDALWOOD',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 385,
        reserved: 50,
        damaged: 2,
        reorderLevel: 140,
        status: 'Out Of Stock',
    },
    {
        sku: 'LME-59',
        productName: 'LME – VETIVER FRESH',
        image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100',
        variantAvailable: 2,
        collectionCategory: 'Men',
        available: 280,
        reserved: 45,
        damaged: 3,
        reorderLevel: 130,
        status: 'On Stock',
    },
];

const columnHelper = createColumnHelper<InventoryItem>();

export default function ProductInventoryPage() {
    const [page, setPage] = useState(1);
    const data = useMemo(() => mockData, []);

    const columns = [
        columnHelper.accessor('sku', {
            header: 'SKU',
            cell: (info) => <span className="text-[#A5A5A5] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('productName', {
            header: 'Product Name',
            cell: (info) => {
                const item = info.row.original;
                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#F2F2F2] bg-gray-50 flex-shrink-0">
                            <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[13px] font-bold text-[#1C1C1C] truncate max-w-[200px]">
                            {item.productName}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('variantAvailable', {
            header: 'Variant Available',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('collectionCategory', {
            header: 'Collection Category',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('available', {
            header: 'Available',
            cell: (info) => <span className="text-[#393939] font-bold">{info.getValue()}</span>,
        }),
        columnHelper.accessor('reserved', {
            header: 'Reserved',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('damaged', {
            header: 'Damaged',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('reorderLevel', {
            header: 'Reorder Level',
            cell: (info) => <span className="text-[#393939] font-medium">{info.getValue()}</span>,
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) => {
                const status = info.getValue();
                const statusStyles = {
                    'On Stock': 'bg-[#E6F4FF] text-[#008BFF]',
                    'Low Stock': 'bg-[#FFF7E6] text-[#FAAD14]',
                    'Critical': 'bg-[#FFF1F0] text-[#F5222D]',
                    'Out Of Stock': 'bg-[#F5F5F5] text-[#8C8C8C]',
                };

                return (
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap",
                        statusStyles[status]
                    )}>
                        {status}
                    </span>
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
                            <DropdownMenuItem className="text-[12px] cursor-pointer">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] cursor-pointer">Edit Stock</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] cursor-pointer text-red-500">Flag Error</DropdownMenuItem>
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
            <div className="bg-white rounded-2xl  overflow-hidden">
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
