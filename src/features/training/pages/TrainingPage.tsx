import { useForm } from 'react-hook-form';
import { ListSkeleton } from '@/components/loading/SkeletonLoaders';
import { zodResolver } from '@hookform/resolvers/zod';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Search01Icon,
  ArrowDown01Icon,
  Upload06Icon,
  FilterMailIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { trainingSchema } from '@/features/training/types';
import type { TrainingModule, TrainingFormValues, TrainingModalState, ModuleFormProps } from '@/features/training/types';
import { 
  useTrainingModules, 
  useCreateTraining, 
  useUpdateTraining, 
  useDeleteTraining, 
  usePublishTraining, 
  useUnpublishTraining 
} from '@/features/training/hooks/use-training';
import { useState } from 'react';

// Removed internal schema and types (moved to types/training.types.ts)

const TRAINING_FOLDERS = [
  { id: 1, name: 'Training Modules', files: 30, size: '137 MB' },
  { id: 2, name: 'Video Library', files: 30, size: '137 MB' },
  { id: 3, name: 'Product Knowledge', files: 30, size: '137 MB' },
  { id: 4, name: 'Distributor Onboarding', files: 30, size: '137 MB' },
  { id: 5, name: 'Certification Tracking', files: 30, size: '137 MB' },
];

function ModuleForm({ initial, onClose, onSaved }: ModuleFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? null,
      sort_order: initial?.sort_order ?? 0,
      is_published: initial?.is_published ?? false,
    },
  });

  const createMutation = useCreateTraining({ onSuccess: onSaved });
  const updateMutation = useUpdateTraining(initial?.id ?? 0, { onSuccess: onSaved });

  const mutationError = createMutation.error ?? updateMutation.error;

  function onSubmit(values: TrainingFormValues): void {
    if (initial) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="bg-white rounded-xl w-full max-w-lg">
        <header className="px-6 py-4 border-b border-gray-100">
          <h2 id="module-modal-title" className="text-base font-semibold text-gray-900">
            {initial ? 'Edit Module' : 'New Module'}
          </h2>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
          {mutationError instanceof Error && (
            <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {mutationError.message}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="module-title" className="block text-sm font-medium text-gray-700">
              Title <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id="module-title"
              type="text"
              {...register('title')}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="module-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="module-description"
              rows={3}
              {...register('description')}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="module-sort-order" className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              id="module-sort-order"
              type="number"
              min={0}
              step={1}
              {...register('sort_order', { valueAsNumber: true })}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors.sort_order && (
              <p className="text-xs text-red-600">{errors.sort_order.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="module-is-published"
              type="checkbox"
              {...register('is_published')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="module-is-published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initial ? 'Save Changes' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TrainingPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<TrainingModalState>(null);
  const [search, setSearch] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { hasPermission } = useAuth();

  const { data, isLoading, isError } = useTrainingModules(page);
  const deleteMutation = useDeleteTraining();
  const publishMutation = usePublishTraining();
  const unpublishMutation = useUnpublishTraining();

  function handleDelete(m: TrainingModule): void {
    if (!window.confirm(`Delete "${m.title}"? This action cannot be undone.`)) return;
    deleteMutation.mutate(m.id);
  }

  function handlePublishToggle(m: TrainingModule): void {
    if (m.is_published) {
      unpublishMutation.mutate(m.id);
    } else {
      publishMutation.mutate(m.id);
    }
  }

  function handleModalClose(): void {
    setModal(null);
  }

  function handleModalSaved(): void {
    setModal(null);
  }

  const result = data?.success ? data.data : null;

  const totalPages = result?.pagination?.last_page ?? 1;
  const currentPage = result?.pagination?.current_page ?? page;

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

  const canCreate = hasPermission('training.create');
  const canUpdate = hasPermission('training.update');
  const canDelete = hasPermission('training.delete');
  const hasActions = canUpdate || canDelete;

  const handleExport = (format: string) => console.log(`Exporting as ${format}`);
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
      <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Trainings & Module</h1>

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
            <button
              onClick={() => setModal('create')}
              className="flex items-center gap-1.5 bg-stone-900 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors h-8"
            >
              <span className="hidden sm:inline">Create Folder</span>
              <HugeiconsIcon icon={Add01Icon} size={14} />
            </button>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Folders Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Folders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TRAINING_FOLDERS.map((folder) => (
            <div key={folder.id} className="bg-white p-7 rounded-[28px] border border-stone-100 flex flex-col justify-between min-h-[188px] hover:border-stone-200 transition-all group">
              <div className="flex items-start justify-between">
                <img src="/folder.png" className="w-16 grayscale" alt="" />
                <button className="text-stone-300 hover:text-stone-500 transition-colors">
                  <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-stone-800 leading-tight">{folder.name}</h3>
                <p className="text-xs text-stone-400 font-medium mt-1">
                  {folder.files} Files &nbsp; · &nbsp; {folder.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Files Section */}
      <div className="pt-2 space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Recent Files</h2>

        {isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
            Loading training modules...
          </div>
        )}

        {isError && (
          <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            Failed to load training modules. Please try again.
          </div>
        )}

        {result && (
          <>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="pb-3 text-left pl-4 sm:pl-0 w-8">
                      <div className="w-4 h-4 border-2 border-stone-100 rounded-[3px]" />
                    </th>
                    <th className="pb-3 text-left text-[10px] font-bold text-stone-400/80 pr-4 sm:pr-6 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        File Name
                        <div className="flex flex-col -gap-1 opacity-50">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M18 15l-6-6-6 6" />
                          </svg>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </th>
                    <th className="pb-3 text-left text-[10px] font-bold text-stone-400/80 pr-4 sm:pr-6 uppercase tracking-wider">Type</th>
                    <th className="pb-3 text-left text-[10px] font-bold text-stone-400/80 pr-4 sm:pr-6 uppercase tracking-wider">File Size</th>
                    <th className="pb-3 text-left text-[10px] font-bold text-stone-400/80 pr-4 sm:pr-6 uppercase tracking-wider">Uploaded By</th>
                    <th className="pb-3 text-left text-[10px] font-bold text-stone-400/80 pr-4 sm:pr-6 uppercase tracking-wider">Date</th>
                    {hasActions && <th className="pb-3 text-right text-[10px] font-bold text-stone-400/80 pr-4 sm:pr-0 uppercase tracking-wider">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {result.modules.length === 0 ? (
                    <tr>
                      <td colSpan={hasActions ? 7 : 6} className="py-16 text-center text-stone-400">
                        No training modules found
                      </td>
                    </tr>
                  ) : (
                    result.modules.map((m: TrainingModule) => (
                      <tr key={m.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors group">
                        <td className="py-4 pl-4 sm:pl-0">
                          <div className="w-4 h-4 border-2 border-stone-100 rounded-[3px] group-hover:border-stone-200 transition-colors" />
                        </td>
                        <td className="py-4 pr-6">
                          <p className="text-xs font-bold text-stone-500 truncate max-w-sm">{m.title}</p>
                        </td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center p-1 font-bold text-[7px] bg-[#EF4444] text-white rounded-[2px] w-4.5 h-4.5 uppercase leading-none">
                              pdf
                            </div>
                            <div className="bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-[3px] text-[10px] font-bold uppercase w-fit tracking-tight">
                              PDF
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-6 text-xs text-stone-400 font-medium">12.5 MB</td>
                        <td className="py-4 pr-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-stone-100 overflow-hidden ring-1 ring-stone-100">
                              <img src={`https://ui-avatars.com/api/?name=${m.id}&background=random`} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-bold text-stone-500">Juan Dela Cruz</span>
                          </div>
                        </td>
                        <td className="py-4 pr-6 text-[11px] text-stone-500 font-bold whitespace-nowrap">
                          {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        {hasActions && (
                          <td className="py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="text-stone-300 hover:text-stone-500 transition-colors focus:outline-none">
                                <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-32">
                                {canUpdate && (
                                  <>
                                    <DropdownMenuItem onClick={() => setModal(m)}>
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handlePublishToggle(m)}
                                      disabled={publishMutation.isPending || unpublishMutation.isPending}
                                    >
                                      {m.is_published ? 'Unpublish' : 'Publish'}
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {canDelete && (
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(m)}
                                    disabled={deleteMutation.isPending}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 mt-2">
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-tight">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-stone-300 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
                </button>
                <div className="flex items-center gap-1">
                  {pageNumbers.map((n, i) =>
                    n === 'ellipsis' ? (
                      <span key={`e-${i}`} className="w-7 h-7 flex items-center justify-center text-[10px] text-stone-300">…</span>
                    ) : (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-bold transition-colors ${currentPage === n
                          ? 'bg-stone-900 text-white'
                          : 'text-stone-400 hover:bg-stone-50'
                          }`}
                      >
                        {n}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-md text-stone-300 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>


      {modal !== null && (
        <ModuleForm
          initial={modal === 'create' ? null : modal}
          onClose={handleModalClose}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  );
}


