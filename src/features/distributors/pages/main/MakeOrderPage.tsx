import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    ArrowLeft01Icon,
    Search01Icon,
    FilterMailIcon,
    PlusSignIcon,
    ArrowTurnBackwardIcon,
    Download01Icon,
    Cancel01Icon,
    ArrowDown01Icon,
    Sorting02Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import { cn } from '@/lib/utils';

const PRODUCTS = [
    { id: 1, name: 'Supremacy', sku: 'SI-1023', image: '/perfume-product.png' },
    { id: 2, name: 'YVS', sku: 'SI-3050', image: '/perfume-product.png' },
    { id: 3, name: 'BERLIN', sku: 'SI-3050', image: '/perfume-product.png' },
    { id: 4, name: 'Intensely', sku: 'SI-3050', image: '/perfume-product.png' },
    { id: 5, name: 'Exilir', sku: 'SI-3050', image: '/perfume-product.png' },
    { id: 6, name: 'Mango Flame', sku: 'SI-3050', image: '/perfume-product.png' },
    { id: 7, name: 'BERLIN', sku: 'SI-3050', image: '/perfume-product.png' },
    { id: 8, name: 'BERLIN', sku: 'SI-3050', image: '/perfume-product.png' },
    { id: 9, name: 'BERLIN', sku: 'SI-3050', image: '/perfume-product.png' },
];

const CATEGORIES = [
    'All Products',
    "Men's Collection",
    "Women's Collection",
    'Best Sellers',
    'Best Sellers',
];

export default function MakeOrderPage() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const [selectedTab, setSelectedTab] = useState('Featured');
    const [selectedCategory, setSelectedCategory] = useState('All Products');

    return (
        <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
            {/* Top Navigation Bar */}
            <header className="px-8 py-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-stone-400 mb-1">{today}</p>
                    <h1 className="text-2xl font-bold text-stone-900">Make an Order</h1>
                </div>
                <Button variant="outline" className="h-10 border-stone-200 text-stone-600 px-4 rounded-lg flex items-center gap-2">
                    Export As
                    <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                </Button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Product Selection */}
                <div className="flex-1 border-r border-stone-100 flex flex-col bg-white">
                    <div className="p-6 space-y-6">
                        {/* Return Link */}
                        <Link
                            to="/distributor/orders"
                            className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center">
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                            </div>
                            <span className="text-sm font-medium">Return</span>
                        </Link>

                        {/* Search Bar */}
                        <div className="relative">
                            <Input
                                placeholder="Search"
                                className="h-11 pl-4 pr-10 border-stone-200 rounded-lg text-sm bg-white"
                            />
                            <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center border-l border-stone-200">
                                <HugeiconsIcon icon={Search01Icon} size={18} className="text-stone-400" />
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                                        selectedCategory === cat
                                            ? "bg-stone-900 text-white border-stone-900"
                                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-8 border-b border-stone-100">
                            {['Featured', 'Popular', 'Recent'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={cn(
                                        "pb-2 text-sm font-semibold transition-all relative",
                                        selectedTab === tab
                                            ? "text-stone-900"
                                            : "text-stone-400 hover:text-stone-600"
                                    )}
                                >
                                    {tab}
                                    {selectedTab === tab && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6">
                        <div className="grid grid-cols-3 gap-4">
                            {PRODUCTS.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    <div className="aspect-square bg-[#F5F5F5] rounded-lg overflow-hidden mb-2 relative border border-transparent group-hover:border-stone-200 transition-all">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                        />
                                    </div>
                                    <h3 className="text-sm font-semibold text-stone-900 truncate">{product.name}</h3>
                                    <p className="text-xs text-stone-400">{product.id === 1 ? 'SI-1023' : 'SI-3050'}</p>
                                    {product.id === 1 && (
                                        <div className="mt-2 h-[2px] bg-stone-900 w-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Form */}
                <div className="flex-1 overflow-y-auto bg-white p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Status bar & Header Actions */}
                        <div className="flex items-center justify-between">
                            <button className="text-xs font-medium text-stone-400 border border-stone-200 px-2.5 py-1 rounded-lg hover:bg-stone-50">
                                Reset All
                            </button>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] text-stone-400">Last Updated: Jan 16, 2025 - 5:03Pm</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-8 border-stone-200 text-stone-900 font-semibold gap-1.5 px-3">
                                        Import
                                        <HugeiconsIcon icon={Download01Icon} size={12} />
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 border-stone-200 text-stone-900 font-semibold gap-1.5 px-3">
                                        Filter
                                        <HugeiconsIcon icon={FilterMailIcon} size={12} />
                                    </Button>
                                    <Button variant="default" size="sm" className="h-8 bg-stone-900 text-white font-semibold gap-1.5 px-3 hover:bg-stone-800">
                                        Make an Order
                                        <HugeiconsIcon icon={PlusSignIcon} size={12} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Top Form Buttons */}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 border-stone-200 text-stone-900 font-semibold gap-1.5 px-3">
                                Save As Draft
                                <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={12} />
                            </Button>
                            <Button variant="default" size="sm" className="h-8 bg-stone-900 text-white font-semibold gap-1.5 px-3 hover:bg-stone-800">
                                Make Payment
                                <HugeiconsIcon icon={PlusSignIcon} size={12} />
                            </Button>
                        </div>

                        {/* Main Form Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-stone-900">Customer</label>
                                <div className="flex gap-2">
                                    <Select defaultValue="distributor">
                                        <SelectTrigger className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-sm">
                                            <SelectValue placeholder="Auto-filled for Distributor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="distributor">Auto-filled for Distributor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="secondary" className="h-10 w-10 p-0 bg-stone-900 text-white rounded-lg hover:bg-stone-800">
                                        <HugeiconsIcon icon={PlusSignIcon} size={16} />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-stone-900">Biller</label>
                                <Select>
                                    <SelectTrigger className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-sm">
                                        <SelectValue placeholder="select biller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="biller1">Biller 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-stone-900">Warehouse</label>
                                <Select>
                                    <SelectTrigger className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-sm">
                                        <SelectValue placeholder="select warehouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wh1">Warehouse 1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-stone-900">Reference No.</label>
                                <Input placeholder="S-3216549815a" className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-sm" />
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="border-t border-stone-100 pt-5">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-stone-100">
                                        <TableHead className="text-stone-400 font-medium text-xs py-2 h-auto">
                                            <div className="flex items-center gap-1">
                                                Product SKU <HugeiconsIcon icon={Sorting02Icon} size={12} />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-stone-400 font-medium text-center text-xs py-2 h-auto">Price</TableHead>
                                        <TableHead className="text-stone-400 font-medium text-center text-xs py-2 h-auto">Quantity</TableHead>
                                        <TableHead className="text-stone-400 font-medium text-center text-xs py-2 h-auto">Tax</TableHead>
                                        <TableHead className="text-stone-400 font-medium text-center text-xs py-2 h-auto">
                                            <div className="flex items-center justify-center gap-1">
                                                Discount <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-stone-400 font-medium text-right text-xs py-2 h-auto">
                                            <div className="flex items-center justify-end gap-1">
                                                Sub-total <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-stone-400 font-medium text-right text-xs py-2 h-auto">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-stone-100">
                                        <TableCell className="py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-stone-50 rounded p-1 border border-stone-100">
                                                    <img src="/perfume-product.png" alt="product" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-semibold text-stone-900 text-xs text-nowrap">SI-1023</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold text-stone-900 text-[13px]">₱ 389.00</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button className="w-5 h-5 rounded border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 text-xs">
                                                    -
                                                </button>
                                                <span className="w-6 text-center text-xs font-semibold">2</span>
                                                <button className="w-5 h-5 rounded border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 text-xs">
                                                    +
                                                </button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold text-stone-900 text-[13px]">₱5.00</TableCell>
                                        <TableCell className="text-center font-semibold text-stone-900 text-[13px]">₱10.00</TableCell>
                                        <TableCell className="text-right font-bold text-stone-900 text-[13px]">₱788.00</TableCell>
                                        <TableCell className="text-right">
                                            <button className="text-rose-500 hover:text-rose-700">
                                                <HugeiconsIcon icon={Cancel01Icon} size={16} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Summary Inputs Section */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-900">Total Price</label>
                                <div className="relative">
                                    <Input value="185.00" readOnly className="h-10 border-stone-200 rounded-lg bg-stone-50/50 pr-8 shadow-none text-stone-400 font-medium text-xs" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium text-xs">P</span>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-900">Total Item</label>
                                <Input value="1" readOnly className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-stone-900 font-medium text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-900">Total Tax</label>
                                <Input value="8" readOnly className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-stone-900 font-medium text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-900">Shipping</label>
                                <Input value="1" className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-stone-900 font-medium text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-stone-900">Total Discount</label>
                                <Input value="1" className="h-10 border-stone-200 rounded-lg bg-white shadow-none text-stone-900 font-medium text-xs" />
                            </div>
                        </div>

                        {/* Grand Total */}
                        <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-stone-900">Grand Total</h2>
                            <span className="text-2xl font-extrabold text-stone-900">₱788.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
