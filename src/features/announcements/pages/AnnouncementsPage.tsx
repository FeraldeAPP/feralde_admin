import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Add01Icon,
    Search01Icon,
    ArrowDown01Icon,
    Upload06Icon,
    FilterMailIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Megaphone01Icon,
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
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  announcementSchema, 
  type Announcement, 
  type AnnouncementFormValues, 
  type AnnouncementModalMode 
} from '../types';
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  usePublishAnnouncement,
  useUnpublishAnnouncement,
} from '../hooks/use-announcements';

const columnHelper = createColumnHelper<Announcement>();

function AnnouncementModal({
  mode,
  onClose,
}: {
  mode: Exclude<AnnouncementModalMode, null>;
  onClose: () => void;
}): React.ReactElement {
  const editing = typeof mode !== 'string' ? mode.edit : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: editing
      ? {
          title: editing.title,
          body: editing.body,
          image_url: editing.image_url ?? null,
          target_roles: editing.target_roles ?? null,
          is_pinned: editing.is_pinned,
          expires_at: editing.expires_at ? editing.expires_at.slice(0, 10) : null,
        }
      : {
          title: '',
          body: '',
          image_url: null,
          target_roles: null,
          is_pinned: false,
          expires_at: null,
        },
  });

  const createMutation = useCreateAnnouncement({ onSuccess: onClose });
  const updateMutation = useUpdateAnnouncement(editing?.id ?? 0, { onSuccess: onClose });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const mutationData = (createMutation.data ?? updateMutation.data) as any;
  const apiErrorMessage =
    mutationData && !mutationData.success ? mutationData.message : null;

  const onSubmit = (values: AnnouncementFormValues): void => {
    if (editing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2
          id="announcement-modal-title"
          className="text-lg font-bold text-stone-900 mb-5"
        >
          {editing ? 'Edit Announcement' : 'New Announcement'}
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
            <label htmlFor="ann-title" className="block text-sm font-medium text-stone-700 mb-1">
              Title <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="ann-title"
              type="text"
              {...register('title')}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ann-body" className="block text-sm font-medium text-stone-700 mb-1">
              Body <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <textarea
              id="ann-body"
              rows={6}
              {...register('body')}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500 resize-y"
            />
            {errors.body && (
              <p className="mt-1 text-xs text-red-600">{errors.body.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ann-image" className="block text-sm font-medium text-stone-700 mb-1">
              Image URL
            </label>
            <input
              id="ann-image"
              type="url"
              {...register('image_url', {
                setValueAs: (v: string) => (v === '' ? null : v),
              })}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>

          <div>
            <label htmlFor="ann-expires" className="block text-sm font-medium text-stone-700 mb-1">
              Expires At
            </label>
            <input
              id="ann-expires"
              type="date"
              {...register('expires_at', {
                setValueAs: (v: string) => (v === '' ? null : v),
              })}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="ann-pinned"
              type="checkbox"
              {...register('is_pinned')}
              className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
            />
            <label htmlFor="ann-pinned" className="text-sm font-medium text-stone-700">
              Pinned
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
    const { hasPermission } = useAuth();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [exportOpen, setExportOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [modal, setModal] = useState<AnnouncementModalMode>(null);

    const canCreateAnn = hasPermission('marketing.create');
    const canUpdateAnn = hasPermission('marketing.update');
    const canDeleteAnn = hasPermission('marketing.delete');

    const filters = {
        per_page: 15,
        page,
        search: search || undefined,
    };

    const { data, isLoading, isError } = useAnnouncements(filters);
    const deleteMutation = useDeleteAnnouncement();
    const publishMutation = usePublishAnnouncement();
    const unpublishMutation = useUnpublishAnnouncement();

    const handleExport = (format: 'pdf' | 'docx' | 'svg' | 'html') => {
        console.log(`Exporting as ${format}`);
    };

    const handleDelete = (a: Announcement): void => {
        if (!window.confirm(`Delete announcement "${a.title}"? This cannot be undone.`)) {
            return;
        }
        deleteMutation.mutate(a.id);
    };

    const handlePublishToggle = (a: Announcement): void => {
        if (a.is_published) {
            unpublishMutation.mutate(a.id);
        } else {
            publishMutation.mutate(a.id);
        }
    };

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
        columnHelper.accessor('title', {
            header: () => (
                <div className="flex items-center gap-1">
                    Announcement Title
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </div>
            ),
            cell: (info) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center shrink-0">
                        <HugeiconsIcon icon={Megaphone01Icon} size={14} className="text-stone-500" />
                    </div>
                    <p className="text-sm text-stone-800 font-medium truncate max-w-[300px]">{info.getValue()}</p>
                </div>
            ),
        }),
        columnHelper.accessor('is_pinned', {
            header: 'Pinned',
            cell: (info) => (
                <span className={cn(
                    "inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    info.getValue() ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-stone-400"
                )}>
                    {info.getValue() ? 'Pinned' : 'No'}
                </span>
            ),
        }),
        columnHelper.accessor('is_published', {
            header: 'Status',
            cell: (info) => (
                <span className={cn(
                    "inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                    info.getValue() ? "bg-green-50 text-green-700 border border-green-200" : "bg-stone-50 text-stone-500 border border-stone-200"
                )}>
                    {info.getValue() ? 'Published' : 'Draft'}
                </span>
            ),
        }),
        columnHelper.accessor('expires_at', {
            header: 'Expires',
            cell: (info) => <span className="text-sm text-stone-500">{info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : 'No expiry'}</span>,
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Action</div>,
            cell: (info) => {
                const a = info.row.original;
                return (
                    <div className="flex justify-end gap-3 text-xs font-semibold">
                        {canUpdateAnn && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setModal({ edit: a })}
                                    className="text-stone-400 hover:text-stone-700 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePublishToggle(a)}
                                    disabled={publishMutation.isPending || unpublishMutation.isPending}
                                    className="text-stone-400 hover:text-stone-700 transition-colors disabled:opacity-50"
                                >
                                    {a.is_published ? 'Unpublish' : 'Publish'}
                                </button>
                            </>
                        )}
                        {canDeleteAnn && (
                            <button
                                type="button"
                                onClick={() => handleDelete(a)}
                                disabled={deleteMutation.isPending}
                                className="text-stone-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                );
            },
        }),
    ];

    const table = useReactTable({
        data: result?.announcements ?? [],
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
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">All Announcements</h1>

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
                    {canCreateAnn && (
                        <Button
                            onClick={() => setModal('create')}
                            className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
                        >
                            <span className="hidden sm:inline">Add Announcement</span>
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
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Title')}>By Title</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Status')}>By Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Date')}>By Date</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="py-16 text-center text-sm text-stone-400">
                    Loading announcements...
                </div>
            )}

            {/* Error */}
            {isError && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to load announcements. Please try again.
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
                                                    ${header.id === 'title' ? 'pl-4 sm:pl-0' : ''}
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
                                            No announcements found
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                            {row.getVisibleCells().map(cell => (
                                                <td
                                                    key={cell.id}
                                                    className={`py-3.5 pr-6 
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

            {modal !== null && (
                <AnnouncementModal mode={modal} onClose={() => setModal(null)} />
            )}
        </div>
    );
}
