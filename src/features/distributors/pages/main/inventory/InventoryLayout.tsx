import { useState } from "react"
import { Link, useRouterState, Outlet } from "@tanstack/react-router"
import {
    Search01Icon,
    FilterMailIcon,
    ArrowDown01Icon,
    Upload06Icon,
    Add01Icon,
    Audit01Icon,
    PackageIcon,
    CourseIcon,
    RankingIcon,
    ChartAverageIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InventoryLayout() {
    const { location } = useRouterState()
    const [exportOpen, setExportOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

    const TABS = [
        { label: 'Overview', to: '/distributor/inventory', icon: Audit01Icon },
        { label: 'Product Inventory', to: '/distributor/inventory/products', icon: PackageIcon },
        { label: 'Inventory Movement', to: '/distributor/inventory/movement', icon: CourseIcon },
        { label: 'Inventory Allocation', to: '/distributor/inventory/allocation', icon: RankingIcon },
        { label: 'Reorder Monitoring', to: '/distributor/inventory/reorder', icon: ChartAverageIcon },
    ];

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = "Jan 16, 2025 - 5:03PM";

    return (
        <div className="flex flex-col gap-6 p-4 font-[var(--font-bricolage)] text-[#393939] max-w-[1600px] mx-auto min-h-screen">
            {/* Header section with Date, Title and Export */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between w-full">
                    <p className="text-[12px] text-[#A5A5A5] font-medium leading-tight">{today}</p>
                    <div className="relative">
                        <DropdownMenu open={exportOpen} onOpenChange={setExportOpen}>
                            <DropdownMenuTrigger >
                                <Button variant="outline" className="h-9 px-4 flex items-center justify-center gap-2 border-[#E5E7EB] text-[#393939] shrink-0 text-[12px] font-bold rounded-lg hover:bg-white transition-colors focus:outline-none shadow-none bg-white">
                                    <span>Export As</span>
                                    <HugeiconsIcon
                                        icon={ArrowDown01Icon}
                                        size={14}
                                        className={`text-[#A5A5A5] transition-transform duration-200 ${exportOpen ? 'rotate-180' : ''}`}
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="bottom" className="w-32 min-w-0 border-[#F2F2F2] rounded-xl shadow-lg">
                                <DropdownMenuItem className="text-[12px] text-[#393939] cursor-pointer py-2">PDF</DropdownMenuItem>
                                <DropdownMenuItem className="text-[12px] text-[#393939] cursor-pointer py-2">Excel</DropdownMenuItem>
                                <DropdownMenuItem className="text-[12px] text-[#393939] cursor-pointer py-2">CSV</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1C1C1C]">My Inventory</h1>
            </div>

            {/* Row 3: Search + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                <div className="relative flex-1 sm:max-w-[320px]">
                    <div className="relative flex items-center w-full bg-white border border-[#E5E7EB] rounded-xl h-10 overflow-hidden group focus-within:border-[#393939] transition-colors">
                        <Input
                            placeholder="Search"
                            className="border-none shadow-none focus-visible:ring-0 text-[13px] h-full px-4 flex-1 placeholder:text-[#A5A5A5] bg-transparent"
                        />
                        <div className="px-4 flex items-center justify-center">
                            <HugeiconsIcon icon={Search01Icon} size={18} className="text-[#A5A5A5]" />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center text-[11px] text-[#A5A5A5] font-medium ml-auto">
                    Last Updated: {lastUpdated}
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 px-4 flex items-center border-[#E5E7EB] rounded-xl shadow-none bg-white hover:bg-gray-50 gap-2 text-[13px] font-bold text-[#393939]">
                        Import <HugeiconsIcon icon={Upload06Icon} size={18} className="text-[#A5A5A5]" />
                    </Button>
                    <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
                        <DropdownMenuTrigger >
                            <Button variant="outline" className="h-10 px-4 flex items-center border-[#E5E7EB] rounded-xl shadow-none bg-white hover:bg-gray-50 gap-2 text-[13px] font-bold text-[#393939]">
                                {activeFilter ?? "Filter"}
                                <HugeiconsIcon
                                    icon={FilterMailIcon}
                                    size={18}
                                    className={`text-[#A5A5A5] transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="bottom" className="w-40 min-w-0 border-[#F2F2F2] rounded-xl shadow-lg">
                            <DropdownMenuItem className="text-[12px] text-[#393939] cursor-pointer py-2" onClick={() => setActiveFilter("By Stock")}>By Stock</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-[#393939] cursor-pointer py-2" onClick={() => setActiveFilter("By Date")}>By Date</DropdownMenuItem>
                            <DropdownMenuItem className="text-[12px] text-[#393939] cursor-pointer py-2" onClick={() => setActiveFilter("By Category")}>By Category</DropdownMenuItem>
                            {activeFilter && (
                                <DropdownMenuItem className="text-[12px] text-red-500 cursor-pointer py-2" onClick={() => setActiveFilter(null)}>Clear Filter</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="h-10 px-4 flex items-center bg-[#1C1C1C] hover:bg-[#1C1C1C]/90 text-white rounded-xl shadow-none gap-2 text-[13px] font-bold">
                        Replenish <HugeiconsIcon icon={Add01Icon} size={18} />
                    </Button>
                </div>
            </div>

            {/* Row 4: Tabs Row */}
            <div className="flex items-center gap-4 text-xs font-bold border-b border-stone-100 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                {TABS.map((tab) => (
                    <Link
                        key={tab.label}
                        to={tab.to}
                        className={cn(
                            'pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-max',
                            location.pathname === tab.to ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
                        )}
                    >
                        <HugeiconsIcon icon={tab.icon} size={12} />
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Content Area */}
            <div className="mt-2">
                <Outlet />
            </div>
        </div>
    )
}
