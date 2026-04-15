import { useState } from 'react';
import { StatsGridSkeleton } from '@/components/loading/SkeletonLoaders';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Search01Icon,
  ArrowDown01Icon,
  Upload06Icon,
  FilterMailIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfitTrendChart } from '@/features/accounting/components/ProfitTrendChart';
import { CategoryListCard } from '@/features/accounting/components/CategoryListCard';


const trendData = [
  { day: 'Sun', value: 400 },
  { day: 'Mon', value: 600 },
  { day: 'Tue', value: 1200, isSelected: true },
  { day: 'Wed', value: 700 },
  { day: 'Thu', value: 800 },
  { day: 'Fri', value: 500 },
  { day: 'Sat', value: 900 },
];

const operatingExpenses = [
  { category: 'Salaries', amount: 9800 },
  { category: 'Rent', amount: 28624 },
  { category: 'Marketing Ads', amount: 12000 },
  { category: 'Utilities', amount: 10000 },
  { category: 'Office Supplies', amount: 15000 },
  { category: 'Maintenance', amount: 20000 },
  { category: 'Miscellaneous', amount: 12500 },
];

const revenueData = [
  { category: 'Distributor Sales', amount: 9800 },
  { category: 'Retail Shop Sales', amount: 28624 },
  { category: 'Training Fees', amount: 12000 },
  { category: 'Franchise Fees', amount: 10000 },
];

const cogsData = [
  { category: 'Product Manufacturing Cost', amount: 142000 },
  { category: 'Packaging Cost', amount: 8500 },
  { category: 'Delivery to Distributors', amount: 6200 },
  { category: 'Import / Freight Charges', amount: 12300 },
];

export default function LeaderboardPage() {
  const [search, setSearch] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    setExportOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 bg-white min-h-full">
      {/* Date + Export As */}
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
      <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Profit & Loss</h1>

      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400"
          />
        </div>

        <div className="hidden md:flex items-center text-xs text-stone-400 shrink-0">
          Last Updated: {lastUpdated}
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <Button 
            className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
          >
            <span className="hidden sm:inline">Add Expense</span>
            <HugeiconsIcon icon={Add01Icon} size={14} />
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-stone-200 text-stone-600">
            <span className="hidden sm:inline">Import</span>
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
            <DropdownMenuContent align="end" side="bottom" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0">
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('This Month')}>This Month</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('Last Quarter')}>Last Quarter</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Category')}>By Category</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="pt-2 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Chart + Revenue/COGS) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProfitTrendChart data={trendData} className="w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <CategoryListCard
              title="Revenue"
              data={revenueData}
              totalLabel="Total Revenue"
              totalAmount={305624}
            />
            <CategoryListCard
              title="Cost of Goods Sold (COGS)"
              data={cogsData}
              totalLabel="Total COGS"
              totalAmount={169000}
            />
          </div>
        </div>

        {/* Right Column (Operating Expense) - Spans full height of the group on the left */}
        <div className="lg:col-span-1 flex">
          <CategoryListCard
            title="Operating Expense"
            data={operatingExpenses}
            totalLabel="Total Operating Expenses"
            totalAmount={150400}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
