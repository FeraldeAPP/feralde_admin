
import {
    Search01Icon,
    FilterIcon,
    ArrowDown01Icon,
    ArrowUp01Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Calendar03Icon,
    MoreHorizontalIcon,
    Folder02Icon,
    Coins01Icon,
    ArrowUpRight01Icon,
    TiktokIcon,
    GlobalIcon,
    Wallet02Icon,
    Sun01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar,
    ReferenceDot,
} from "recharts"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, } from "@/components/ui/avatar"

const statsData = [
    { title: "Total Active Distributors", value: "28", change: "+2.5%", icon: Folder02Icon, color: "text-[#4F46E5]" },
    { title: "Total Distributor Revenue", value: "₱255,000", change: "+2.5%", icon: Folder02Icon, color: "text-[#10B981]" },
    { title: "Total Units Sold", value: "1,680 units", change: "+2.5%", icon: Folder02Icon, color: "text-[#F59E0B]" },
    { title: "Avg Revenue per Distributor", value: "₱9,107", change: "+2.5%", icon: Folder02Icon, color: "text-[#EC4899]" },
]

const salesData = [
    { month: "JAN", value: 15000 },
    { month: "FEB", value: 25000 },
    { month: "MAR", value: 20000 },
    { month: "APR", value: 35000 },
    { month: "MAY", value: 45000 },
    { month: "JUN", value: 38000 },
    { month: "JUL", value: 68000 },
    { month: "AUG", value: 42000 },
    { month: "SEP", value: 48000 },
    { month: "OCT", value: 40000 },
    { month: "NOV", value: 55000 },
    { month: "DEC", value: 50000 },
]

const paymentData = [
    { name: "Manual (GCash / Bank)", value: 45, color: "#DBEAFE" },
    { name: "Cash on Delivery", value: 25, color: "#0A335C" },
    { name: "Gateway — PayMongo", value: 20, color: "#008BFF" },
    { name: "Maya", value: 10, color: "#60A5FA" },
]

const platforms = [
    { name: "Shopee", icon: "S", color: "text-white bg-[#EE4D2D]", revenue: "₱ 2,850,000", orders: 252, trend: "+12.5%" },
    { name: "TikTok", icon: TiktokIcon, color: "text-white bg-black", revenue: "₱ 2,100,000", orders: 240, trend: "+12.5%" },
    { name: "Lazada Shop", icon: "L", color: "text-white bg-[#000083]", revenue: "₱ 2,100,000", orders: 250, trend: "+12.5%" },
    { name: "Shopify", icon: GlobalIcon, color: "text-white bg-[#96bf48]", revenue: "₱ 2,100,000", orders: 357, trend: "+12.5%" },
]

const totalOrdersData = [
    { day: "Sun", value: 400 },
    { day: "Mon", value: 600 },
    { day: "Tue", value: 300 },
    { day: "Wed", value: 1200, isSelected: true },
    { day: "Thu", value: 700 },
    { day: "Fri", value: 800 },
    { day: "Sat", value: 500 },
]

const summaryData = [
    { title: "Gross Revenue", value: "₱ 1,578,430.00", trend: "+35%", icon: Coins01Icon, iconBg: "bg-[#F0F9FF]", iconColor: "text-[#008BFF]" },
    { title: "Net Profit", value: "₱ 462,150.00", trend: "+35%", icon: Wallet02Icon, iconBg: "bg-[#F5F3FF]", iconColor: "text-[#7B61FF]" },
    { title: "Orders Today", value: "342", trend: "+35%", icon: Sun01Icon, iconBg: "bg-[#FFFBEB]", iconColor: "text-[#F59E0B]" },
]

const topDistributors = [
    { id: "ORD-10022", name: "Cotidiano Local Hub", shop: "Distri Shop", items: "5 items", amount: "₱2,500.00", commission: "5%", method: "Cash on Delivery", status: "Delivered", date: "Nov 17, 2025", deliveryDate: "Nov 20, 2025", shopColor: "bg-[#000000]" },
    { id: "ORD-10027", name: "Scenta Bliss Co.", shop: "Distri Shop", items: "3 items", amount: "₱1,100.00", commission: "5%", method: "Gcash", status: "Shipped", date: "Nov 22, 2025", deliveryDate: "Nov 24, 2025", shopColor: "bg-[#0A335C]" },
    { id: "ORD-10028", name: "JM Perfumes", shop: "Distri Shop", items: "7 items", amount: "₱4,500.00", commission: "3%", method: "PayMongo", status: "Cancelled", date: "Nov 23, 2025", deliveryDate: "-", shopColor: "bg-[#000000]" },
]

const latestOrders = [
    { id: "SO-1001", customer: "Juan Dela Cruz", product: "LME 50ml", qty: 1, total: "879.75", method: "COD", date: "Feb 20, 2026", status: "Delivered", avatar: "JD" },
    { id: "SO-1002", customer: "Maria Sanchez", product: "LUMINA 50ml", qty: 2, total: "1,599.50", method: "Maya", date: "Feb 21, 2026", status: "Pending", avatar: "MS" },
    { id: "SO-1003", customer: "Carlos Gomez", product: "AURA 100ml", qty: 1, total: "1,189.25", method: "GCash", date: "Feb 22, 2026", status: "Shipped", avatar: "CG" },
    { id: "SO-1005", customer: "Luis Martinez", product: "AMOURA 50ml", qty: 1, total: "1,245.00", method: "COD", date: "Feb 24, 2026", status: "Pending", avatar: "LM" },
]

export default function DistributorDashboard() {
    return (
        <div className="flex flex-col gap-6 p-2 font-[var(--font-bricolage)] text-[#393939]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-[12px] text-[#A5A5A5] font-medium leading-tight">Friday, 16 January 2026</p>
                    <h1 className="text-2xl font-bold tracking-tight text-[#393939]">Dashboard Overview</h1>
                </div>
                <div className="flex items-center shrink-0">
                    <Button variant="outline" className="h-10 px-0 flex items-center border-[#F2F2F2] rounded-xl overflow-hidden shadow-none bg-white hover:bg-white w-full sm:w-auto">
                        <span className="px-5 text-[13px] font-bold text-[#393939]">Export As</span>
                        <div className="w-[1px] h-full bg-[#F2F2F2]" />
                        <div className="px-3.5 flex items-center justify-center">
                            <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-[#393939]" />
                        </div>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex items-center w-full md:max-w-[400px] bg-white border border-[#F2F2F2] rounded-xl h-10 overflow-hidden">
                    <Input
                        placeholder="Search"
                        className="border-none shadow-none focus-visible:ring-0 text-[13px] h-full px-4 flex-1 placeholder:text-[#A5A5A5] bg-transparent"
                    />
                    <div className="w-[1px] h-full bg-[#F2F2F2]" />
                    <div className="px-4 flex items-center justify-center">
                        <HugeiconsIcon icon={Search01Icon} size={18} className="text-[#A5A5A5]" />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <span className="text-[11px] text-[#A5A5A5] font-medium order-2 sm:order-1">Last Updated: Jan 16, 2025 - 5:03pm</span>
                    <Button variant="outline" className="h-10 px-0 flex items-center border-[#F2F2F2] rounded-xl overflow-hidden shadow-none bg-white hover:bg-white order-1 sm:order-2 w-full sm:w-auto">
                        <span className="px-4 text-[13px] font-bold text-[#393939]">Filter</span>
                        <div className="w-[1px] h-full bg-[#F2F2F2]" />
                        <div className="px-3 flex items-center justify-center">
                            <HugeiconsIcon icon={FilterIcon} size={16} className="text-[#393939]" />
                        </div>
                    </Button>
                </div>
            </div>




            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, i) => (
                    <Card key={i} className="border-[#F2F2F2] shadow-none rounded-2xl overflow-hidden bg-white py-0">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <span className="text-[14px] font-medium text-[#393939] leading-tight mt-1">{stat.title}</span>
                                <div className="h-8 w-8 rounded-full border border-[#F2F2F2] flex items-center justify-center bg-[#FAFAFA] shrink-0">
                                    <HugeiconsIcon icon={stat.icon} size={16} className="text-[#A5A5A5]" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-5">
                                <span className="text-[24px] font-bold text-[#393939] tracking-tight whitespace-nowrap">{stat.value}</span>
                                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    <Badge variant="secondary" className="bg-[#F0FDF4] text-[#16A34A] hover:bg-[#F0FDF4] border-none font-bold px-1.5 py-0 h-5 rounded-md text-[10px]">
                                        {stat.change}
                                    </Badge>
                                    <span className="text-[11px] text-[#C1C1C1] font-medium whitespace-nowrap">vs. last month</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2 border-[#F2F2F2] shadow-none rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9]">
                                <HugeiconsIcon icon={Wallet02Icon} size={20} className="text-[#393939]" />
                            </div>
                            <div>
                                <CardTitle className="text-[15px] font-bold text-[#393939]">Total Sales Overview</CardTitle>
                                <p className="text-[12px] text-[#A5A5A5]">Daily revenue performance for the last 12 months</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[20px] font-bold text-[#393939]">₱78,200.00</span>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-[#F2F2F2] rounded-lg">
                                <span className="text-[12px] font-bold text-[#393939]">This Year</span>
                                <HugeiconsIcon icon={FilterIcon} size={14} className="text-[#393939]" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2 h-[340px] px-6 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#008BFF" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#008BFF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#F2F2F2" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#A5A5A5', fontWeight: 500 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#A5A5A5', fontWeight: 500 }}
                                    tickFormatter={(value) => `${value / 1000}K`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#008BFF"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-[#F2F2F2] shadow-none rounded-2xl">
                    <CardHeader className="flex flex-row items-center gap-3 pb-2 px-6 pt-6">
                        <div className="h-9 w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9]">
                            <HugeiconsIcon icon={Wallet02Icon} size={20} className="text-[#393939]" />
                        </div>
                        <div>
                            <CardTitle className="text-[15px] font-bold text-[#393939]">Monthly Payments Breakdown</CardTitle>
                            <p className="text-[12px] text-[#A5A5A5]">Weekly summary of all payments received this month</p>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2 px-6">
                        <div className="h-[240px] relative mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={75}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {paymentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 pb-4">
                            {paymentData.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: item.color }} />
                                    <span className="text-[11px] text-[#393939] font-bold truncate">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dashboard Middle Section: Top Products, Metrics & Signups */}
            <div className="flex flex-col xl:flex-row gap-4">
                {/* Left Column: Top Selling Products */}
                <Card className="w-full xl:w-[320px] shrink-0 border-[#F2F2F2] shadow-none rounded-2xl flex flex-col">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9]">
                                <HugeiconsIcon icon={Wallet02Icon} size={18} className="text-[#393939]" />
                            </div>
                            <div className="flex flex-col">
                                <CardTitle className="text-[15px] font-bold text-[#393939]">Top Selling Products</CardTitle>
                                <p className="text-[11px] text-[#A5A5A5] leading-tight mt-0.5 font-medium">Best-performing products based on total units sold</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6 pt-0 flex flex-col">
                        <div className="space-y-6">
                            {[
                                { name: "Chivarly", sold: "520 sold", img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100" },
                                { name: "Yves", sold: "412 sold", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=100" },
                                { name: "Serenity", sold: "350 sold", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=100" },
                                { name: "Celest", sold: "275 sold", img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=100" }
                            ].map((prod, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                        <img src={prod.img} alt={prod.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[13px] font-bold text-[#393939] leading-tight">{prod.name}</p>
                                        <p className="text-[11px] text-[#A5A5A5] mt-1 font-medium">{prod.sold}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-10">
                            <Button className="w-full bg-[#393939] hover:bg-[#393939]/90 text-white rounded-xl h-11 text-[13px] font-bold flex items-center justify-center gap-2 shadow-none border-none">
                                See All Products
                                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Summaries + Chart */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Horizontal Summaries */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Total Products", value: "248", icon: Wallet02Icon, arrowColor: "text-[#A5A5A5]" },
                            { title: "Low Stock Items", value: "17", icon: Wallet02Icon, arrowColor: "text-[#10B981]" },
                            { title: "Out of Stock", value: "9", icon: Wallet02Icon, arrowColor: "text-[#F97316]" },
                            { title: "Total Stock Value", value: "₱1,583,420", icon: Wallet02Icon, arrowColor: "text-[#008BFF]" },
                        ].map((stat, i) => (
                            <Card key={i} className="border-[#F2F2F2] shadow-none rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-8 w-8 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9]">
                                        <HugeiconsIcon icon={stat.icon} size={16} className="text-[#393939]" />
                                    </div>
                                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} className={stat.arrowColor} />
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#A5A5A5] font-medium leading-tight">{stat.title}</p>
                                    <p className="text-[20px] font-bold text-[#393939] mt-1.5">{stat.value}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* New Distributor Signups Chart */}
                    <Card className="flex-1 border-[#F2F2F2] shadow-none rounded-2xl flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg border border-[#F2F2F2] flex items-center justify-center bg-[#F9F9F9]">
                                    <HugeiconsIcon icon={Wallet02Icon} size={18} className="text-[#393939]" />
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-[15px] font-bold text-[#393939]">New Distributor Signups</CardTitle>
                                    <p className="text-[11px] text-[#A5A5A5] leading-tight mt-0.5 font-medium">Daily growth trend of newly activated distributors</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[180px] pt-6 pb-2 px-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                    { date: "Jan 14", value: 10 },
                                    { date: "Jan 15", value: 15 },
                                    { date: "Jan 16", value: 12 },
                                    { date: "Jan 17", value: 20 },
                                    { date: "Jan 18", value: 28 },
                                    { date: "Jan 19", value: 22 },
                                    { date: "Jan 20", value: 25 },
                                    { date: "Jan 21", value: 18 },
                                    { date: "Jan 22", value: 24 },
                                    { date: "Jan 23", value: 26 },
                                    { date: "Jan 24", value: 20 },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F2F2" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#A5A5A5', fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#333333"
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                    <ReferenceDot
                                        x="Jan 18"
                                        y={28}
                                        r={8}
                                        fill="#A594F9"
                                        stroke="#fff"
                                        strokeWidth={4}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4">
                {/* Left: Total Orders Chart */}
                <Card className="lg:col-span-1 xl:col-span-4 border-[#F2F2F2] shadow-none rounded-2xl flex flex-col p-4 min-w-0">
                    <div className="flex items-center justify-between gap-2 overflow-hidden">
                        <div className="min-w-0">
                            <CardTitle className="text-[16px] font-semibold text-[#515151] truncate">Total Orders</CardTitle>
                            <p className="text-[14px] text-[#AAB1BB] font-medium mt-0.5">Today</p>
                        </div>
                        <div className="flex items-center gap-2 p-2 border border-[#F2F2F2] rounded-lg shrink-0">
                            <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-[#515151]" />
                            <span className="text-[12px] font-semibold text-[#515151]">Today</span>
                            <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-[#515151]" />
                        </div>
                    </div>

                    <div className="mt-4 flex-1 flex flex-col min-h-0">
                        <div className="flex items-end justify-between mb-4 shrink-0">
                            <span className="text-[24px] font-semibold text-[#515151]">5,125</span>
                        </div>
                        <div className="flex-1 w-full min-h-[160px] mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={totalOrdersData} margin={{ bottom: 0, left: -20, right: -20 }}>
                                    <Bar
                                        dataKey="value"
                                        radius={[6, 6, 6, 6]}
                                        barSize={32}
                                    >
                                        {totalOrdersData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.isSelected ? "#A594F9" : "#F2F0FF"}
                                            />
                                        ))}
                                    </Bar>
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#AAB1BB', fontWeight: 500 }}
                                        dy={10}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="mt-2 pt-3 border-t border-[#F2F2F2] flex items-center justify-between gap-4">
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                <span className="text-[12px] font-medium text-[#515151] truncate">Trending up this month</span>
                                <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="text-[#515151] shrink-0" />
                            </div>
                            <span className="text-[12px] text-[#AAB1BB] font-medium">vs last month</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1 border border-[#F2F2F2] rounded-lg shrink-0">
                            <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} className="text-[#0CAF60]" />
                            <span className="text-[12px] font-semibold text-[#0CAF60]">+12.5%</span>
                        </div>
                    </div>
                </Card>

                {/* Middle: Platform Grid (2x2) */}
                <div className="lg:col-span-1 xl:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {platforms.map((platform, i) => (
                        <Card key={i} className="border-[#F2F2F2] shadow-none rounded-2xl flex flex-col p-4 min-w-0">
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className={`h-11 w-11 rounded-xl ${platform.color} flex items-center justify-center text-lg font-bold shrink-0`}>
                                    {typeof platform.icon === 'string' ? platform.icon : <HugeiconsIcon icon={platform.icon} size={22} />}
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-[16px] font-semibold text-[#515151] truncate">{platform.name}</CardTitle>
                                    <p className="text-[14px] text-[#AAB1BB] font-medium">Today</p>
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-2 mt-4">
                                <div className="min-w-0">
                                    <p className="text-[13px] text-[#AAB1BB] font-medium truncate">Gross Revenue</p>
                                    <p className="text-[18px] font-semibold text-[#515151] mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{platform.revenue}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] text-[#AAB1BB] font-medium truncate">Orders</p>
                                    <p className="text-[18px] font-semibold text-[#515151] mt-1 truncate">{platform.orders}</p>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-[#F2F2F2] flex items-center justify-between gap-4">
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5 overflow-hidden">
                                        <span className="text-[12px] font-medium text-[#515151] truncate">Trending up</span>
                                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="text-[#515151] shrink-0" />
                                    </div>
                                    <span className="text-[12px] text-[#AAB1BB] font-medium">vs last month</span>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1 border border-[#F2F2F2] rounded-lg shrink-0">
                                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} className="text-[#0CAF60]" />
                                    <span className="text-[12px] font-semibold text-[#0CAF60]">+12.5%</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Right: Summary Stack (1x3 on Desktop, Row on Tablet) */}
                <div className="lg:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-4">
                    {summaryData.map((item, i) => (
                        <Card key={i} className="border-[#F2F2F2] shadow-none rounded-2xl p-4 flex flex-col min-w-0">
                            <div className="flex items-start justify-between gap-4 overflow-hidden">
                                <CardTitle className="text-[15px] font-semibold text-[#AAB1BB] truncate">{item.title}</CardTitle>
                                <div className={`h-10 w-10 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                                    <HugeiconsIcon icon={item.icon} size={20} className={item.iconColor} />
                                </div>
                            </div>
                            <div className="mt-2 overflow-hidden">
                                <span className="text-[20px] font-semibold text-[#515151] block truncate">{item.value}</span>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <div className="flex items-center gap-1 shrink-0">
                                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="text-[#0CAF60]" />
                                        <span className="text-[12px] font-semibold text-[#0CAF60]">{item.trend}</span>
                                    </div>
                                    <span className="text-[12px] text-[#AAB1BB] font-medium whitespace-nowrap">from last month</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 gap-6">
                {/* Top Distributors Table */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold px-2">Top Distributors</h2>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Order ID</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Distributor</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Items</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Total Amount</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Commission</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Payment Method</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Status</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Order Date</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Delivery Date</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topDistributors.map((row) => (
                                    <TableRow key={row.id} className="border-t border-[#F2F2F2] hover:bg-transparent">
                                        <TableCell className="text-[13px] font-medium text-[#393939] py-4">{row.id}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[11px] text-[#A5A5A5] font-medium">{row.shop}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-5 w-5 rounded-full ${row.shopColor} flex items-center justify-center overflow-hidden`}>
                                                        {row.name.includes("Scenta") && (
                                                            <div className="h-2 w-2 bg-white/20 rotate-45" />
                                                        )}
                                                    </div>
                                                    <span className="text-[13px] font-bold text-[#393939]">{row.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4">{row.items}</TableCell>
                                        <TableCell className="text-[13px] font-bold text-[#393939] py-4">{row.amount}</TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4">{row.commission}</TableCell>
                                        <TableCell className="text-[13px] font-bold text-[#393939] py-4">{row.method}</TableCell>
                                        <TableCell className="py-4">
                                            <div className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[11px] font-bold ${row.status === 'Delivered' ? 'bg-[#ECFDF5] text-[#10B981]' :
                                                row.status === 'Shipped' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
                                                    'bg-[#FEF2F2] text-[#EF4444]'
                                                }`}>
                                                {row.status}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4">{row.date}</TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4">{row.deliveryDate}</TableCell>
                                        <TableCell className="text-right py-4">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#A5A5A5]">
                                                <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4 px-2">
                        <span className="text-[12px] text-[#A5A5A5] font-medium">Page 1 of 4</span>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-[#F2F2F2] shadow-none">
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} className="text-[#393939]" />
                            </Button>
                            <Button className="h-8 w-8 rounded-lg bg-[#393939] text-white shadow-none text-[12px] font-bold">1</Button>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg text-[#393939] text-[12px] font-bold">2</Button>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg text-[#393939] text-[12px] font-bold">3</Button>
                            <span className="px-1 text-[#A5A5A5]">...</span>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg text-[#393939] text-[12px] font-bold">4</Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-[#F2F2F2] shadow-none">
                                <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-[#393939]" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Latest Orders Table */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-bold px-2">Latest Orders</h2>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="w-[50px] text-[#A5A5A5] h-12">
                                        <div className="h-4 w-4 rounded border border-[#F2F2F2]" />
                                    </TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Order ID</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">
                                        <div className="flex items-center gap-1">
                                            Customer Name
                                            <div className="flex flex-col -gap-1">
                                                <HugeiconsIcon icon={ArrowUp01Icon} size={8} className="text-[#A5A5A5]" />
                                                <HugeiconsIcon icon={ArrowDown01Icon} size={8} className="text-[#A5A5A5]" />
                                            </div>
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Products</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12 text-center">Qty</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Total (₱)</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Payment Method</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12">Order Date</TableHead>
                                    <TableHead className="text-[12px] font-medium text-[#A5A5A5] h-12 text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {latestOrders.map((order) => (
                                    <TableRow key={order.id} className="border-t border-[#F2F2F2] hover:bg-transparent">
                                        <TableCell className="py-4">
                                            <div className="h-4 w-4 rounded border border-[#F2F2F2]" />
                                        </TableCell>
                                        <TableCell className="text-[13px] font-medium text-[#393939] py-4">{order.id}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7">
                                                    <AvatarFallback className="bg-[#F2F2F2] text-[10px] font-bold">{order.avatar}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-[13px] font-bold text-[#393939]">{order.customer}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4">{order.product}</TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4 text-center">{order.qty}</TableCell>
                                        <TableCell className="text-[13px] font-bold text-[#393939] py-4">{order.total}</TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4">{order.method}</TableCell>
                                        <TableCell className="text-[13px] text-[#393939] py-4">{order.date}</TableCell>
                                        <TableCell className="text-right py-4">
                                            <div className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[11px] font-bold ${order.status === 'Delivered' ? 'bg-[#ECFDF5] text-[#10B981]' :
                                                order.status === 'Shipped' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
                                                    'bg-[#FFF7ED] text-[#F97316]'
                                                }`}>
                                                {order.status}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between pt-4 px-2">
                        <span className="text-[12px] text-[#A5A5A5] font-medium">Page 1 of 4</span>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-[#F2F2F2] shadow-none">
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} className="text-[#393939]" />
                            </Button>
                            <Button className="h-8 w-8 rounded-lg bg-[#393939] text-white shadow-none text-[12px] font-bold">1</Button>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg text-[#393939] text-[12px] font-bold">2</Button>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg text-[#393939] text-[12px] font-bold">3</Button>
                            <span className="px-1 text-[#A5A5A5]">...</span>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg text-[#393939] text-[12px] font-bold">4</Button>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-[#F2F2F2] shadow-none">
                                <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-[#393939]" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
