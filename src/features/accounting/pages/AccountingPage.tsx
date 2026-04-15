import { useState } from 'react';
import { useExpenses, useExpenseStats } from '../hooks/use-expenses';
import { TableSkeleton } from '@/components/loading/SkeletonLoaders';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Search01Icon,
  ArrowDown01Icon,
  Upload06Icon,
  FilterMailIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Folder02Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { Expense, ExpenseFilters } from '../types';

const columnHelper = createColumnHelper<Expense>();

export default function AccountingPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [exportOpen, setExportOpen] = useState(false);

  const filters: ExpenseFilters = {
    per_page: 15,
    page,
    search: search || undefined,
  };

  const { data: expensesData, isLoading: loadingExpenses } = useExpenses(filters);
  const { data: statsData } = useExpenseStats();

  const result = expensesData?.success ? expensesData.data : null;
  const stats = statsData?.success ? statsData.data : null;
  const totalPages = result?.pagination.last_page ?? 1;
  const currentPage = result?.pagination.current_page ?? page;

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-stone-300 accent-stone-900"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-stone-300 accent-stone-900"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('id', {
      header: () => (
        <div className="flex items-center gap-1">
          Expense ID
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      ),
      cell: (info) => <span className="font-medium text-stone-900">{info.getValue()}</span>,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => <span className="text-stone-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => <span className="text-stone-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('department', {
      header: 'Department',
      cell: (info) => <span className="text-stone-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => <span className="text-stone-500 truncate max-w-[150px]">{info.getValue()}</span>,
    }),
    columnHelper.accessor('vendor', {
      header: 'Vendor',
      cell: (info) => <span className="text-stone-500 font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('payment_method', {
      header: 'Payment Method',
      cell: (info) => <span className="text-stone-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: 'Amount (P)',
      cell: (info) => <span className="text-stone-900 font-semibold">{info.getValue().toLocaleString()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Payment Status',
      cell: (info) => {
        const status = info.getValue();
        return (
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            status === 'Paid' && "bg-green-50 text-green-600",
            status === 'Approved' && "bg-blue-50 text-blue-600",
            status === 'Pending' && "bg-orange-50 text-orange-600"
          )}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('approved_by', {
      header: 'Approved By',
      cell: (info) => {
        const approver = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-100">
              <img src={approver.avatar} alt={approver.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-stone-500 text-xs">{approver.name}</span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      cell: () => (
        <div className="text-right">
          <button className="text-stone-400 hover:text-stone-600">
            <span className="text-xl leading-none">...</span>
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: result?.expenses ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const lastUpdated = "Jan 16, 2025 - 5:03Pm"; // Static for matching figma exactly or could be dynamic

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-stone-400 font-medium">{today}</p>
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-stone-900 -mt-2">Expenses (Accounts Payable)</h1>
      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
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
          <Button size="sm" className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8">
            <span className="hidden sm:inline">Add Expense</span>
            <HugeiconsIcon icon={Add01Icon} size={14} />
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-stone-200 text-stone-600 px-3 sm:px-4 h-8 rounded-lg font-medium">
            <span className="hidden sm:inline">Import</span>
            <HugeiconsIcon icon={Upload06Icon} size={14} className="rotate-180" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 border border-stone-200 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 font-medium">
              <span className="hidden sm:inline">Filter</span>
              <HugeiconsIcon
                icon={FilterMailIcon}
                size={15}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>By Date</DropdownMenuItem>
              <DropdownMenuItem>By Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={stats?.total_expenses.amount.toLocaleString() ?? '0'}
          trend={stats?.total_expenses.trend ?? 0}
          chart="/expenses/chart-up.svg"
          type="bar"
        />
        <StatCard
          title="Outstanding Payables"
          value={stats?.outstanding_payables.amount.toLocaleString() ?? '0'}
          trend={stats?.outstanding_payables.trend ?? 0}
          chart="/expenses/chart-pie.svg"
          type="pie"
          percentage={stats?.outstanding_payables.percentage}
        />
        <StatCard
          title="Overdue Payables"
          value={stats?.overdue_payables.amount.toLocaleString() ?? '0'}
          trend={stats?.overdue_payables.trend ?? 0}
          chart="/expenses/chart-line-1.svg"
          type="area"
        />
        <StatCard
          title="Recurring Expenses"
          value={stats?.recurring_expenses.amount.toLocaleString() ?? '0'}
          trend={stats?.recurring_expenses.trend ?? 0}
          chart="/expenses/chart-line-2.svg"
          type="area"
        />
      </div>



      {/* Table */}
      <div className="relative">
        {loadingExpenses && <TableSkeleton rows={15} columns={7} />}
        <div className="overflow-x-auto border-t border-stone-100 mt-2">
          <table className="min-w-full text-sm">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="py-4 text-left text-xs font-semibold text-stone-400 pr-4 whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-stone-100">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-stone-50/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-4 pr-4">
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
      <div className="flex items-center justify-between pt-6 border-t border-stone-100">
        <span className="text-xs font-semibold text-stone-400">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          <div className="flex items-center gap-1">
            {pageNumbers.map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors",
                  currentPage === n ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-50"
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, chart, type, percentage }: {
  title: string;
  value: string;
  trend: number;
  chart: string;
  type: 'bar' | 'pie' | 'area';
  percentage?: number;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-100  relative overflow-hidden group hover:border-stone-200 transition-all">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400">
              <HugeiconsIcon icon={Folder02Icon} size={18} />
            </div>
            <h3 className="text-sm font-medium text-stone-500">{title}</h3>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-stone-900">₱ {value}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[11px] font-bold">
                +{trend}%
              </span>
              <span className="text-[11px] text-stone-400 font-medium">vs. last month</span>
            </div>
          </div>
        </div>

        {/* Fixed position for the chart image from Figma */}
        <div className="absolute bottom-0 right-0 h-16 w-24">
          <img src={chart} alt="" className="w-full h-full object-contain object-bottom opacity-80 group-hover:opacity-100 transition-opacity" />
          {type === 'pie' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center -mb-2 -mr-1">
              <span className="text-xs font-bold text-stone-900">{percentage}%</span>
              <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">Total</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
