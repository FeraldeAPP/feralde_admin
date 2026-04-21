import {
    Folder02Icon,
    Calendar03Icon,
    ArrangeByLettersAZIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const statsData = [
    { title: "Total SKUs", value: "128", change: "+2.5%", icon: Folder02Icon },
    { title: "Total Stock Units", value: "14,860 units", change: "+2.5%", icon: Folder02Icon },
    { title: "Total Inventory Value (Cost)", value: "₱4,285,000", change: "+2.5%", icon: Folder02Icon },
    { title: "Total Inventory Value (SRP)", value: "₱7,920,000", change: "+2.5%", icon: Folder02Icon },
]

const stockTrendData = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 6000 },
    { month: "Mar", value: 5000 },
    { month: "Apr", value: 7000 },
    { month: "May", value: 12400 },
    { month: "Jun", value: 11000 },
    { month: "Jul", value: 8000 },
    { month: "Aug", value: 9000 },
    { month: "Sep", value: 7500 },
    { month: "Oct", value: 10500 },
    { month: "Nov", value: 11500 },
    { month: "Dec", value: 11000 },
]

const distributionData = [
    { name: "Men's", value: 35, color: "#A594F9" },
    { name: "Women's", value: 25, color: "#C4B5FD" },
    { name: "Unisex", value: 20, color: "#DDD6FE" },
    { name: "Limited Edition", value: 10, color: "#EDE9FE" },
    { name: "Bundles", value: 10, color: "#F5F3FF" },
]

const fastMovingProducts = [
    { name: "LME 50ml", current: 2045, total: 3200 },
    { name: "DOMINAR", current: 2045, total: 3200 },
    { name: "LUMINA", current: 3210, total: 4000 },
    { name: "AURA", current: 1780, total: 2500 },
    { name: "MANGO FLAME", current: 1780, total: 2500 },
]

const lowStockData = [
    { name: "LME – FERALDE PERFUME (Le Male Elixir Inspired)", current: 18, reorder: 50, suggested: 200, img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100" },
    { name: "HERACLES – ECLIPSE EAU DE TOILETTE (Inspired by Euphoria)", current: 24, reorder: 60, suggested: 150, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=100" },
    { name: "HORUS – COSMIC FRAGRANCE", current: 30, reorder: 45, suggested: 300, img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100" },
    { name: "YVES – HORIZON FRESH", current: 12, reorder: 75, suggested: 100, img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100" },
]

const warehousePerformance = [
    { name: "HERACLES – EAST HUB", units: "9,800", value: "₱2.9M", suggested: 6, outOfStock: 1, img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100" },
    { name: "LME – FERALDE MAIN", units: "10,300", value: "₱3.1M", suggested: 8, outOfStock: 2, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=100" },
    { name: "HERACLES – ELITE SHOP", units: "8,700", value: "₱2.5M", suggested: 5, outOfStock: 3, img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100" },
    { name: "YVES – HORIZON FLAGSHIP", units: "8,700", value: "₱2.5M", suggested: 5, outOfStock: 3, img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100" },
]

export default function OverviewPage() {
    return (
        <div className="flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, i) => (
                    <Card key={i} className="border-[#E5E7EB] shadow-none rounded-2xl bg-white p-5">
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-[14px] font-bold text-[#1C1C1C] opacity-80">{stat.title}</span>
                            <div className="h-8 w-8 rounded-full border border-[#F2F2F2] flex items-center justify-center bg-white">
                                <HugeiconsIcon icon={stat.icon} size={16} className="text-[#A5A5A5]" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[24px] font-bold text-[#1C1C1C] tracking-tight">{stat.value}</span>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-[#E6F9EE] text-[#0F973D] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                    {stat.change}
                                </div>
                                <span className="text-[11px] text-[#A5A5A5] font-medium">vs. last month</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock Level Trend */}
                <Card className="lg:col-span-2 border-[#E5E7EB] shadow-none rounded-2xl bg-white overflow-hidden">
                    <div className="flex items-center justify-between p-5 pb-2">
                        <h3 className="text-[15px] font-bold text-[#1C1C1C]">Stock Level Trend</h3>
                        <Button variant="outline" className="h-8 px-4 flex items-center border-[#E5E7EB] rounded-xl shadow-none bg-white gap-2 text-[11px] font-bold text-[#393939]">
                            Today <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-[#A5A5A5]" />
                        </Button>
                    </div>
                    <div className="px-6 h-[280px] relative pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stockTrendData} margin={{ top: 40, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F2" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#A5A5A5', fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#008BFF"
                                    strokeWidth={4}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#008BFF', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="absolute top-[45px] left-[32%] flex flex-col items-center">
                            <div className="bg-[#008BFF] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg relative z-10">
                                12,400 Units
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#008BFF]" />
                            </div>
                            <div className="w-3 h-3 rounded-full border-2 border-white bg-[#008BFF] shadow-sm mt-1" />
                            <div className="w-px h-[160px] bg-dashed border-l border-dashed border-[#008BFF]/30" />
                        </div>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between border-t border-[#F2F2F2]">
                        <span className="text-[20px] font-bold text-[#1C1C1C]">₱6,390.80</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-[#E6F9EE] text-[#0F973D] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                +2.5%
                            </div>
                            <span className="text-[11px] text-[#A5A5A5] font-medium">vs. last month</span>
                        </div>
                    </div>
                </Card>

                {/* Inventory Distribution */}
                <Card className="border-[#E5E7EB] shadow-none rounded-2xl bg-white p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={Folder02Icon} size={18} className="text-[#A5A5A5]" />
                            <h3 className="text-[15px] font-bold text-[#1C1C1C]">Inventory Distribution</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#393939]">
                            Today <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-[#A5A5A5]" />
                        </div>
                    </div>

                    <div className="flex flex-row items-center justify-between flex-1 gap-4">
                        <div className="relative w-[180px] h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[20px] font-black text-[#1C1C1C]">35%</span>
                                <span className="text-[10px] text-[#A5A5A5] font-bold leading-tight text-center">Men's<br />Collection</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 flex-1 min-w-[120px]">
                            {distributionData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-[2px]" style={{ backgroundColor: item.color }} />
                                        <span className="text-[11px] text-[#A5A5A5] font-bold">{item.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Bottom Row 1: Fast Moving & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Top 5 Fast Moving Products */}
                <Card className="border-[#E5E7EB] shadow-none rounded-2xl bg-white overflow-hidden">
                    <div className="flex items-center justify-between p-5 pb-2">
                        <h3 className="text-[15px] font-bold text-[#1C1C1C]">Top 5 Fast Moving Products</h3>
                        <Button variant="outline" className="h-8 px-4 flex items-center border-[#E5E7EB] rounded-xl shadow-none bg-white gap-2 text-[11px] font-bold text-[#393939]">
                            Today <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-[#A5A5A5]" />
                        </Button>
                    </div>
                    <div className="p-5 space-y-5">
                        {fastMovingProducts.map((prod, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full overflow-hidden border border-[#F2F2F2]">
                                            <img src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=40" alt="" className="h-full w-full object-cover" />
                                        </div>
                                        <span className="text-[13px] font-bold text-[#1C1C1C] opacity-80 uppercase leading-none">{prod.name}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-[#1C1C1C]">{prod.current.toLocaleString()}/{prod.total.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-[#F2F2F2] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#008BFF] rounded-full"
                                        style={{ width: `${(prod.current / prod.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Low Stock Alert Table */}
                <Card className="xl:col-span-2 border-[#E5E7EB] shadow-none rounded-2xl bg-white overflow-hidden">
                    <div className="flex items-center justify-between p-5 pb-2">
                        <h3 className="text-[15px] font-bold text-[#1C1C1C]">Low Stock Alert Table</h3>
                        <Button variant="outline" className="h-8 px-4 flex items-center border-[#E5E7EB] rounded-xl shadow-none bg-white gap-2 text-[11px] font-bold text-[#393939]">
                            Today <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-[#A5A5A5]" />
                        </Button>
                    </div>
                    <div>
                        <Table containerClassName="!scrollbar-hide">
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent text-[#A5A5A5]">
                                    <TableHead className="px-6 h-12 text-[11px] font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Product Name <HugeiconsIcon icon={ArrangeByLettersAZIcon} size={12} />
                                        </div>
                                    </TableHead>
                                    <TableHead className="px-6 h-12 text-center text-[11px] font-bold uppercase tracking-wider">Current Stock</TableHead>
                                    <TableHead className="px-6 h-12 text-center text-[11px] font-bold uppercase tracking-wider">Reorder Level</TableHead>
                                    <TableHead className="px-6 h-12 text-center text-[11px] font-bold uppercase tracking-wider">Suggested Order</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lowStockData.map((row, i) => (
                                    <TableRow key={i} className="border-t border-[#F2F2F2] hover:bg-gray-50 transition-colors">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-[#F2F2F2] bg-gray-50">
                                                    <img src={row.img} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <span className="text-[13px] font-bold text-[#1C1C1C] truncate max-w-[280px]">{row.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center text-[13px] font-bold text-[#1C1C1C]">{row.current}</TableCell>
                                        <TableCell className="px-6 py-4 text-center text-[13px] font-bold text-[#1C1C1C]">{row.reorder}</TableCell>
                                        <TableCell className="px-6 py-4 text-center text-[13px] font-bold text-[#1C1C1C]">{row.suggested}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* Bottom Row 2: Cost vs Selling & Warehouse */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Cost vs Selling Value */}
                <Card className="border-[#E5E7EB] shadow-none rounded-2xl bg-white p-6 flex flex-col ">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={Folder02Icon} size={18} className="text-[#A5A5A5]" />
                            <h3 className="text-[15px] font-bold text-[#1C1C1C]">Cost vs Selling Value</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#393939]">
                            Today <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-[#A5A5A5]" />
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-[#A5A5A5] mb-8 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#008BFF]" /> Total Cost Value</div>
                        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#60A5FA]" /> Total SRP Value</div>
                        <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-[#E5E7EB]" /> Potential Gross Profit</div>
                    </div>

                    <div className="h-[140px] relative mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { value: 45, fill: "#008BFF" },
                                        { value: 30, fill: "#60A5FA" },
                                        { value: 25, fill: "#E5E7EB" },
                                    ]}
                                    cx="50%"
                                    cy="100%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-2">
                            <span className="text-[28px] font-black text-[#1C1C1C]">85%</span>
                            <span className="text-[11px] text-[#A5A5A5] font-bold uppercase tracking-wider">Avg Markup</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#F2F2F2]">
                        <span className="text-[20px] font-bold text-[#1C1C1C]">₱4,285,000</span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-[#E6F9EE] text-[#0F973D] px-2 py-0.5 rounded-lg text-[10px] font-bold">
                                +2.5%
                            </div>
                            <span className="text-[11px] text-[#A5A5A5] font-medium">vs. last month</span>
                        </div>
                    </div>
                </Card>

                {/* Warehouse Performance */}
                <Card className="xl:col-span-2 border-[#E5E7EB] shadow-none rounded-2xl bg-white overflow-hidden">
                    <div className="flex items-center justify-between p-5 pb-2">
                        <h3 className="text-[15px] font-bold text-[#1C1C1C]">Warehouse Performance</h3>
                        <Button variant="outline" className="h-8 px-4 flex items-center border-[#E5E7EB] rounded-xl shadow-none bg-white gap-2 text-[11px] font-bold text-[#393939]">
                            Today <HugeiconsIcon icon={Calendar03Icon} size={14} className="text-[#A5A5A5]" />
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <Table className="overflow-x-hidden">
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent text-[#A5A5A5]">
                                    <TableHead className="px-6 h-12 text-[11px] font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-2">
                                            Warehouse <HugeiconsIcon icon={ArrangeByLettersAZIcon} size={12} />
                                        </div>
                                    </TableHead>
                                    <TableHead className="px-6 h-12 text-center text-[11px] font-bold uppercase tracking-wider">Total Units</TableHead>
                                    <TableHead className="px-6 h-12 text-center text-[11px] font-bold uppercase tracking-wider">Value</TableHead>
                                    <TableHead className="px-6 h-12 text-center text-[11px] font-bold uppercase tracking-wider">Suggested Order</TableHead>
                                    <TableHead className="px-6 h-12 text-center text-[11px] font-bold uppercase tracking-wider">Out of Stock</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {warehousePerformance.map((row, i) => (
                                    <TableRow key={i} className="border-t border-[#F2F2F2] hover:bg-gray-50 transition-colors">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-[#F2F2F2] bg-gray-50">
                                                    <img src={row.img} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <span className="text-[13px] font-bold text-[#1C1C1C] truncate max-w-[200px]">{row.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-center text-[13px] font-bold text-[#1C1C1C]">{row.units}</TableCell>
                                        <TableCell className="px-6 py-4 text-center text-[13px] font-bold text-[#1C1C1C]">{row.value}</TableCell>
                                        <TableCell className="px-6 py-4 text-center text-[13px] font-bold text-[#1C1C1C]">{row.suggested}</TableCell>
                                        <TableCell className="px-6 py-4 text-center text-[13px] font-bold text-[#EF4444]">{row.outOfStock}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
