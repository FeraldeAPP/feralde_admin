import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useDistributors } from '../hooks/use-distributors';
import { useAuth } from '@/hooks/use-auth';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Search01Icon,
  ArrowDown01Icon,
  Upload06Icon,
  FilterMailIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  UserGroupIcon,
  Clock01Icon,
  CheckListIcon,
  Cancel01Icon,
  AlertCircleIcon,
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
import type { Distributor, DistributorRank, DistributorFilters } from '../types';

const RANK_COLORS: Record<DistributorRank, string> = {
  STARTER: 'bg-stone-50 text-stone-600 border-stone-200',
  BRONZE: 'bg-orange-50 text-orange-700 border-orange-200',
  SILVER: 'bg-slate-50 text-slate-600 border-slate-200',
  GOLD: 'bg-amber-50 text-amber-700 border-amber-200',
  PLATINUM: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  DIAMOND: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

function StatusBadge({ d }: { d: Distributor }): React.ReactElement {
  console.log(d

  )
  if (d.suspended_at) return <span className="text-red-500 font-medium">Suspended</span>;
  if (d.rejected_at) return <span className="text-stone-400 font-medium">Rejected</span>;
  if (d.approved_at) return <span className="text-emerald-600 font-medium">Approved</span>;
  return <span className="text-amber-600 font-medium">Pending</span>;
}

const columnHelper = createColumnHelper<Distributor>();

const TABS = [
  { label: 'All', value: 'all', icon: UserGroupIcon },
  { label: 'Pending', value: 'PENDING', icon: Clock01Icon },
  { label: 'Approved', value: 'APPROVED', icon: CheckListIcon },
  { label: 'Rejected', value: 'REJECTED', icon: Cancel01Icon },
  { label: 'Suspended', value: 'SUSPENDED', icon: AlertCircleIcon },
];

export default function DistributorsPage() {
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleExport = (format: 'pdf' | 'docx' | 'svg' | 'html') => {
    console.log(`Exporting as ${format}`);
  };

  const filters: DistributorFilters = {
    per_page: 15,
    page,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
  };

  const { data, isLoading, isError } = useDistributors(filters);
  const canCreate = hasPermission('distributors.create');
  const result = data?.success ? data.data : null;
  const totalPages = result?.pagination.last_page ?? 1;
  const currentPage = result?.pagination.current_page ?? page;

  const pageNumbers: (number | 'ellipsis')[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push('ellipsis');
    pageNumbers.push(totalPages);
  }

  const columns = [
    columnHelper.accessor('distributor_code', {
      header: () => (
        <div className="flex items-center gap-1">
          Code
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      ),
      cell: (info) => (
        <Link
          to="/distributors/$id"
          params={{ id: String(info.row.original.id) }}
          className="font-mono font-medium text-stone-900 hover:text-stone-600 transition-colors"
        >
          {info.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor('rank', {
      header: 'Rank',
      cell: (info) => (
        <span className={cn(
          'inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border tracking-wider',
          RANK_COLORS[info.getValue()]
        )}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('assigned_city', {
      header: 'Assigned City',
      cell: (info) => <span className="text-sm text-stone-500">{info.getValue() ?? '—'}</span>,
    }),
    columnHelper.accessor('total_personal_sales', {
      header: () => <div className="text-right">Personal Sales</div>,
      cell: (info) => (
        <div className="text-right text-sm text-stone-800 font-medium">
          ₱{parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </div>
      ),
    }),
    columnHelper.accessor('total_network_sales', {
      header: () => <div className="text-right">Network Sales</div>,
      cell: (info) => (
        <div className="text-right text-sm text-stone-800 font-medium">
          ₱{parseFloat(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'status',
      header: () => <div className="text-center">Status</div>,
      cell: (info) => (
        <div className="text-center text-xs">
          <StatusBadge d={info.row.original} />
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      cell: (info) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-stone-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem >
                <Link
                  to="/distributors/$id"
                  params={{ id: String(info.row.original.id) }}
                  className="cursor-pointer"
                >
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 cursor-pointer">
                Suspend Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: result?.distributors ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-h-full bg-white">

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
      <h1 className="text-xl sm:text-2xl font-bold text-stone-900">All Distributors</h1>

      {/* Tabs Row */}
      <div className="flex items-center gap-4 text-xs font-bold border-b border-stone-100 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={cn(
              'pb-2 transition-colors flex items-center gap-1.5 whitespace-nowrap min-w-max',
              status === tab.value ? 'text-stone-900 border-b-2 border-stone-900' : 'text-stone-400 hover:text-stone-600'
            )}
          >
            <HugeiconsIcon icon={tab.icon} size={12} />
            {tab.label}
            {result && status === tab.value && (
              <span className="ml-1 text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                {result.pagination.total ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

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
          {canCreate && (
            <Button
              variant="default"
              size="sm"
              className="bg-stone-900 text-white hover:bg-stone-700 flex items-center gap-1.5"
            >
              <span className="hidden sm:inline">Add Distributor</span>
              <HugeiconsIcon icon={Add01Icon} size={14} />
            </Button>
          )}
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
            <DropdownMenuContent align="start" side="bottom" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0">
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Rank')}>By Rank</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Status')}>By Status</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By City')}>By City</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-16 text-center text-sm text-stone-400">
          Loading distributors...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load distributors. Please try again.
        </div>
      )}

      {/* Table */}
      {result && (
        <>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full text-sm">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id} className="border-b border-stone-100">
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className={`pb-3 text-left text-xs font-medium text-stone-400 pr-4 sm:pr-6 
                                                    ${header.id === 'distributor_code' ? 'pl-4 sm:pl-0' : ''}
                                                    ${header.id === 'assigned_city' ? 'hidden sm:table-cell' : ''}
                                                    ${header.id === 'total_personal_sales' ? 'hidden md:table-cell' : ''}
                                                    ${header.id === 'actions' ? 'text-right pr-4 sm:pr-0' : ''}
                                                `}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="py-16 text-center text-stone-400">
                      No distributors found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className={`py-3.5 pr-6 
                                                        ${cell.column.id === 'assigned_city' ? 'hidden sm:table-cell' : ''}
                                                        ${cell.column.id === 'total_personal_sales' ? 'hidden md:table-cell' : ''}
                                                        ${cell.column.id === 'actions' ? 'text-right pr-4 sm:pr-0' : ''}
                                                    `}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-xs text-stone-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
              </button>
              {pageNumbers.map((n, i) =>
                n === 'ellipsis' ? (
                  <span key={`e-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-stone-400">…</span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${currentPage === n
                      ? 'bg-stone-900 text-white'
                      : 'border border-stone-200 text-stone-500 hover:bg-stone-50'
                      }`}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 text-stone-400 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


