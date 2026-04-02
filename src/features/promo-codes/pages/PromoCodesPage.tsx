import { createPromoCode, deletePromoCode, getPromoCodes, updatePromoCode } from '@/features/promo-codes/api';
import type { PromoCode, PromoCodeType } from '@/features/promo-codes/types';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Search01Icon,
  MoreHorizontalIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  ArrowDown01Icon,
  FilterMailIcon,
  Upload06Icon
} from '@hugeicons/core-free-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type ModalMode = null | 'create' | { edit: PromoCode };

const PROMO_CODE_TYPES: PromoCodeType[] = [
  'PERCENTAGE_DISCOUNT',
  'FIXED_DISCOUNT',
  'FREE_SHIPPING',
  'BUY_X_GET_Y',
  'BUNDLE_DEAL',
];

const schema = z.object({
  code: z.string().min(1, 'Code is required'),
  description: z.string().nullable().optional(),
  type: z.enum([
    'PERCENTAGE_DISCOUNT',
    'FIXED_DISCOUNT',
    'FREE_SHIPPING',
    'BUY_X_GET_Y',
    'BUNDLE_DEAL',
  ] as const),
  value: z.number().min(0, 'Value must be 0 or more'),
  min_order_amount: z.number().nullable().optional(),
  max_discount: z.number().nullable().optional(),
  usage_limit: z.number().int().nullable().optional(),
  per_user_limit: z.number().int().nullable().optional(),
  is_active: z.boolean().optional(),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

function PromoCodeModal({
  mode,
  onClose,
}: {
  mode: Exclude<ModalMode, null>;
  onClose: () => void;
}): React.ReactElement {
  const queryClient = useQueryClient();
  const editing = mode !== 'create' ? mode.edit : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editing
      ? {
        code: editing.code,
        description: editing.description ?? null,
        type: editing.type,
        value: parseFloat(editing.value),
        min_order_amount:
          editing.min_order_amount !== null
            ? parseFloat(editing.min_order_amount)
            : null,
        max_discount:
          editing.max_discount !== null
            ? parseFloat(editing.max_discount)
            : null,
        usage_limit: editing.usage_limit ?? null,
        per_user_limit: editing.per_user_limit ?? null,
        is_active: editing.is_active,
        starts_at: editing.starts_at ? editing.starts_at.slice(0, 10) : null,
        ends_at: editing.ends_at ? editing.ends_at.slice(0, 10) : null,
      }
      : {
        code: '',
        description: null,
        type: 'PERCENTAGE_DISCOUNT',
        value: 0,
        min_order_amount: null,
        max_discount: null,
        usage_limit: null,
        per_user_limit: null,
        is_active: true,
        starts_at: null,
        ends_at: null,
      },
  });

  const createMutation = useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormValues }) =>
      updatePromoCode(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      onClose();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const mutationData = createMutation.data ?? updateMutation.data;
  const apiErrorMessage =
    mutationData && !mutationData.success ? mutationData.message : null;

  const onSubmit = (values: FormValues): void => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center "
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
    >
      <div className="bg-white rounded-xl  w-full max-w-lg p-4  space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto">
        <h2
          id="promo-modal-title"
          className="text-lg font-bold text-gray-900 mb-5"
        >
          {editing ? 'Edit Promo Code' : 'New Promo Code'}
        </h2>

        {(mutationError || apiErrorMessage) && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {mutationError instanceof Error
              ? mutationError.message
              : apiErrorMessage ?? 'An error occurred'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">
              Code <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="promo-code"
              type="text"
              {...register('code')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="promo-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="promo-description"
              rows={2}
              {...register('description')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label htmlFor="promo-type" className="block text-sm font-medium text-gray-700 mb-1">
              Type <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <select
              id="promo-type"
              {...register('type')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROMO_CODE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="promo-value" className="block text-sm font-medium text-gray-700 mb-1">
              Value <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="promo-value"
              type="number"
              step="0.01"
              min={0}
              {...register('value', { valueAsNumber: true })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.value && (
              <p className="mt-1 text-xs text-red-600">{String(errors.value.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="promo-min-order" className="block text-sm font-medium text-gray-700 mb-1">
                Min Order Amount
              </label>
              <input
                id="promo-min-order"
                type="number"
                step="0.01"
                min={0}
                {...register('min_order_amount', {
                  setValueAs: (v: string) => (v === '' ? null : parseFloat(v)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="promo-max-discount" className="block text-sm font-medium text-gray-700 mb-1">
                Max Discount
              </label>
              <input
                id="promo-max-discount"
                type="number"
                step="0.01"
                min={0}
                {...register('max_discount', {
                  setValueAs: (v: string) => (v === '' ? null : parseFloat(v)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="promo-usage-limit" className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit
              </label>
              <input
                id="promo-usage-limit"
                type="number"
                min={0}
                {...register('usage_limit', {
                  setValueAs: (v: string) => (v === '' ? null : parseInt(v, 10)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="promo-per-user" className="block text-sm font-medium text-gray-700 mb-1">
                Per User Limit
              </label>
              <input
                id="promo-per-user"
                type="number"
                min={0}
                {...register('per_user_limit', {
                  setValueAs: (v: string) => (v === '' ? null : parseInt(v, 10)),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="promo-starts-at" className="block text-sm font-medium text-gray-700 mb-1">
                Starts At
              </label>
              <input
                id="promo-starts-at"
                type="date"
                {...register('starts_at', {
                  setValueAs: (v: string) => (v === '' ? null : v),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="promo-ends-at" className="block text-sm font-medium text-gray-700 mb-1">
                Ends At
              </label>
              <input
                id="promo-ends-at"
                type="date"
                {...register('ends_at', {
                  setValueAs: (v: string) => (v === '' ? null : v),
                })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="promo-active"
              type="checkbox"
              {...register('is_active')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="promo-active" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const columnHelper = createColumnHelper<PromoCode>();

export default function PromoCodesPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active'>('all');
  const [modal, setModal] = useState<ModalMode>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission('promo_codes.create');
  const canUpdate = hasPermission('promo_codes.update');
  const canDelete = hasPermission('promo_codes.delete');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['promo-codes', page, search, status],
    queryFn: () => getPromoCodes({
      page,
      per_page: 15,
      search: search || undefined,
      is_active: status === 'active' ? true : undefined
    }),
  });

  const result = data?.success ? data.data : null;

  const deleteMutation = useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
    },
  });

  const handleDelete = (promo: PromoCode): void => {
    if (!window.confirm(`Delete promo code "${promo.code}"? This cannot be undone.`)) {
      return;
    }
    deleteMutation.mutate(promo.id);
  };


  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

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
    columnHelper.accessor('code', {
      header: 'Code',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) =>
        info
          .getValue()
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase()),
    }),
    columnHelper.accessor('value', {
      header: 'Value',
      cell: (info) => {
        const promo = info.row.original;
        return (
          <>
            <p className="font-semibold text-stone-900">
              {promo.type === 'PERCENTAGE_DISCOUNT'
                ? `${parseFloat(promo.value).toFixed(0)}%`
                : `₱${parseFloat(promo.value).toLocaleString()}`}
            </p>
            {promo.min_order_amount && (
              <p className="text-[10px] text-stone-400 mt-0.5">
                Min: ₱{parseFloat(promo.min_order_amount).toLocaleString()}
              </p>
            )}
          </>
        );
      },
    }),
    columnHelper.accessor('ends_at', {
      id: 'validity',
      header: 'Validity',
      cell: (info) => {
        const promo = info.row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
              <HugeiconsIcon icon={Calendar03Icon} size={12} className="text-stone-400" />
              {promo.starts_at ? new Date(promo.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Anytime'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pl-[18px]">
              {promo.ends_at ? new Date(promo.ends_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Indefinite'}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('is_active', {
      header: 'Status',
      cell: (info) => {
        const isActive = info.getValue();
        return (
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : 'bg-stone-50 text-stone-400 border border-stone-100'
              }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: (info) => {
        const promo = info.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors outline-none text-right">
              <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem className="cursor-pointer" onClick={() => setModal({ edit: promo })}>
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 font-medium"
                  onClick={() => handleDelete(promo)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: result?.promo_codes ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="flex-1 overflow-auto bg-white" style={{ scrollbarGutter: 'stable' }}>
      <div className="p-4 md:p-6 space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
        {/* Date + Export As */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-stone-400">{today}</p>
          <div className="relative">
            <DropdownMenu open={exportOpen} onOpenChange={setExportOpen}>
              <DropdownMenuTrigger className="flex items-center gap-1.5 border border-stone-200 text-stone-600 shrink-0 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 outline-none">
                <span className="hidden sm:inline">Export As</span>
                <span className="hidden sm:inline w-px h-3.5 bg-stone-300" />
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  className={`transition-transform duration-200 ${exportOpen ? 'rotate-180' : ''}`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" className="w-29 min-w-0">
                <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1">PDF</DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1">.Docx</DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1">SVG</DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1">HTML</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Promotions</h1>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <HugeiconsIcon icon={Search01Icon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 border-stone-200 placeholder:text-stone-400 focus-visible:ring-stone-400"
            />
          </div>

          <div className="hidden md:flex items-center text-xs text-stone-400 shrink-0">
            Last Updated: {lastUpdated}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            {canCreate && (
              <button
                type="button"
                onClick={() => setModal('create')}
                className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
              >
                <span className="hidden sm:inline">Add Promotion</span>
                <HugeiconsIcon icon={Add01Icon} size={14} />
              </button>
            )}
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-stone-200 text-stone-600 h-8">
              <span className="hidden sm:inline">Import</span>
              <HugeiconsIcon icon={Upload06Icon} size={14} className="rotate-180" />
            </Button>
            <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 border border-stone-200 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors h-8 font-medium outline-none">
                <span className="hidden sm:inline">{activeFilter ?? 'Filter'}</span>
                <HugeiconsIcon
                  icon={FilterMailIcon}
                  size={15}
                  className={`transition-transform duration-200 ${filterOpen ? 'rotate-180' : 'rotate-0'}`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0">
                <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('Percentage')}>Percentage</DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('Fixed Amount')}>Fixed Amount</DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('Free Shipping')}>Free Shipping</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b">
          <button
            onClick={() => { setStatus('all'); setPage(1); }}
            className={`pb-4 text-sm font-semibold transition-all relative ${status === 'all' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            All Promotions
          </button>
          <button
            onClick={() => { setStatus('active'); setPage(1); }}
            className={`pb-4 text-sm font-semibold transition-all relative ${status === 'active' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Active
          </button>
        </div>

        {/* Table/List Area */}
        {isLoading ? (
          <div className="bg-white rounded-2xl  px-4 py-24 text-center text-sm text-gray-400  animate-pulse">
            Loading promotions...
          </div>
        ) : isError ? (
          <div role="alert" className="rounded-2xl bg-red-50 border border-red-100 px-6 py-4 text-sm text-red-700 ">
            Failed to load promo codes. Please try again.
          </div>
        ) : result && (
          <div className="bg-white   overflow-hidden ">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-stone-100">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={`pb-3 text-xs font-medium text-stone-400 ${header.column.id === 'code' ? 'text-left pr-4 sm:pr-6 pl-4 sm:pl-0' :
                              header.column.id === 'type' ? 'text-left pr-4 sm:pr-6 hidden sm:table-cell' :
                                header.column.id === 'value' ? 'text-left pr-4 sm:pr-6 hidden md:table-cell' :
                                  header.column.id === 'validity' ? 'text-left pr-4 sm:pr-6 hidden lg:table-cell' :
                                    header.column.id === 'status' ? 'text-center pr-4 sm:pr-6' :
                                      'text-right pr-4 sm:pr-0'
                            }`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-stone-400">
                        No promotions found
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/50 transition-colors group">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={`py-4 ${cell.column.id === 'code' ? 'pr-4 sm:pr-6 font-mono text-xs text-stone-600 uppercase pl-4 sm:pl-0' :
                                cell.column.id === 'type' ? 'pr-4 sm:pr-6 hidden sm:table-cell text-stone-500' :
                                  cell.column.id === 'value' ? 'pr-4 sm:pr-6 hidden md:table-cell' :
                                    cell.column.id === 'validity' ? 'pr-4 sm:pr-6 hidden lg:table-cell' :
                                      cell.column.id === 'status' ? 'pr-4 sm:pr-6 text-center' :
                                        'text-right pr-4 sm:pr-0'
                              }`}
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
          </div>
        )}

        {modal !== null && (
          <PromoCodeModal mode={modal} onClose={() => setModal(null)} />
        )}
      </div>
    </main>
  );
}


