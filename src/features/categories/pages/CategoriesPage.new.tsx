import React, { useState, useRef, useEffect } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/features/categories/api';
import { useAuth } from '@/hooks/use-auth';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Search01Icon,
    ArrowDown01Icon,
    Upload06Icon,
    FilterMailIcon,
    Add01Icon,
    MoreHorizontalIcon,
} from '@hugeicons/core-free-icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Category } from '@/features/categories/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';


// ── Schema ────────────────────────────────────────────────────────────────────

type ModalMode = null | 'create' | { edit: Category };

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable().optional(),
    parent_id: z.number().nullable().optional(),
    sort_order: z.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
    
});

type FormValues = z.infer<typeof schema>;

const inputCls = 'w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-white';
const labelCls = 'block text-xs font-medium text-stone-500 mb-1.5';


function FieldError({ message }: { message: string | undefined }) {
    if (!message) return null;
    return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

// ── Action Menu ───────────────────────────────────────────────────────────────

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
                <HugeiconsIcon icon={MoreHorizontalIcon} size={16} />
            </button>
            {open && (
                <div className="absolute right-0 top-8 z-20 w-32 bg-white border border-stone-200 rounded-lg shadow-md py-1">
                    <button
                        type="button"
                        onClick={() => { onEdit(); setOpen(false); }}
                        className="block w-full text-left px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => { onDelete(); setOpen(false); }}
                        className="block w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Category Modal ────────────────────────────────────────────────────────────

function CategoryModal({ mode, categories, onClose }: {
    mode: Exclude<ModalMode, null>;
    categories: Category[];
    onClose: () => void;
}): React.ReactElement {
    const queryClient = useQueryClient();
    const editing = mode !== 'create' ? mode.edit : null;
    

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: editing ? {
            name: editing.name,
            description: editing.description ?? null,
            parent_id: editing.parent_id ?? null,
            sort_order: editing.sort_order,
            is_active: editing.is_active,
        } : {
            name: '',
            description: null,
            parent_id: null,
            sort_order: 0,
            is_active: true,
        },
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['categories'] }); onClose(); },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: FormValues }) => updateCategory(id, payload),
        onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['categories'] }); onClose(); },
    });

    const isPending = createMutation.isPending || updateMutation.isPending;
    const mutationError = createMutation.error ?? updateMutation.error;
    const mutationData = createMutation.data ?? updateMutation.data;
    const apiErrorMessage = mutationData && !mutationData.success ? mutationData.message : null;

    const onSubmit = (values: FormValues): void => {
        if (editing) updateMutation.mutate({ id: editing.id, payload: values });
        else createMutation.mutate(values);
    };

    const parentOptions = categories.filter((c) => editing === null || c.id !== editing.id);

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-stone-900">
                        {editing ? 'Edit Category' : 'New Category'}
                    </DialogTitle>
                </DialogHeader>

                {(mutationError || apiErrorMessage) && (
                    <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {mutationError instanceof Error ? mutationError.message : apiErrorMessage ?? 'An error occurred'}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <div>
                        <label className={labelCls}>Name *</label>
                        <Input {...register('name')} placeholder="e.g. Men's Collection" className="border-stone-200 focus-visible:ring-stone-400" />
                        <FieldError message={errors.name?.message} />
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea rows={3} {...register('description')} className={`${inputCls} resize-none`} placeholder="Optional description..." />
                    </div>
                    <div>
                        <label className={labelCls}>Parent Category</label>
                        <select {...register('parent_id', { setValueAs: (v: string) => v === '' ? null : Number(v) })} className={inputCls}>
                            <option value="">None (Top Level)</option>
                            {parentOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Sort Order</label>
                        <Input type="number" min={0} {...register('sort_order', { valueAsNumber: true })} className="border-stone-200 focus-visible:ring-stone-400" />
                        <FieldError message={errors.sort_order?.message} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="is_active" type="checkbox" {...register('is_active')} className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400" />
                        <label htmlFor="is_active" className="text-sm text-stone-600">Active</label>
                    </div>

                    <Separator />

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="border-stone-200 text-stone-600">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-stone-900 hover:bg-stone-700 text-white">
                            {isPending ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CategoriesPage(): React.ReactElement {
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState<ModalMode>(null);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const { hasPermission } = useAuth();
    const { location } = useRouterState();
    const [exportOpen, setExportOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    const handleExport = (format: 'pdf' | 'docx' | 'svg' | 'html') => {
        console.log(`Exporting as ${format}`);
    };

    const canCreate = hasPermission('categories.create');
    const canUpdate = hasPermission('categories.update');
    const canDelete = hasPermission('categories.delete');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories', page],
        queryFn: () => getCategories({ page, per_page: 20 }),
    });

    const allCategoriesQuery = useQuery({
        queryKey: ['categories', 'all'],
        queryFn: () => getCategories({ per_page: 200 }),
    });

    const result = data?.success ? data.data : null;
    const allCategories = allCategoriesQuery.data?.success ? allCategoriesQuery.data.data.categories : [];

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['categories'] }); },
    });

    const handleDelete = (cat: Category): void => {
        if (!window.confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
        deleteMutation.mutate(cat.id);
    };

    // Group: parents and their children
    const categories = result?.categories ?? [];
    const filtered = search
        ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
        : categories;
    const parents = filtered.filter((c) => c.parent_id === null);
    const childrenOf = (parentId: number) => filtered.filter((c) => c.parent_id === parentId);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

    const TABS = [
        { label: 'My Products', to: '/products' },
        { label: 'Categories', to: '/categories' },
        { label: 'Bundles', to: '/bundles' },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-h-full bg-white">

            {/* Top */}
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

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Categories</h1>

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
                            type="button"
                            onClick={() => setModal('create')}
                            size="sm"
                            className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-700 text-white"
                        >
                            <span className="hidden sm:inline">Add Category</span>
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
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Price')}>By Price</DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Name')}>By Name</DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Bundle')}>By Bundle</DropdownMenuItem>
        <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Category')}>By Category</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
                </div>
            </div>

            {/* Tabs */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="flex items-center gap-0 border-b border-stone-200 min-w-max sm:min-w-0">
                    {TABS.map((tab) => {
                        const isActive = location.pathname === tab.to;
                        return (
                            <Link
                                key={tab.label}
                                to={tab.to}
                                className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                                    isActive
                                        ? 'border-stone-900 text-stone-900'
                                        : 'border-transparent text-stone-400 hover:text-stone-700'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="py-16 text-center text-sm text-stone-400">Loading categories...</div>
            )}

            {/* Error */}
            {isError && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to load categories. Please try again.
                </div>
            )}

            {deleteMutation.isError && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    Failed to delete category. Please try again.
                </div>
            )}

            {/* Table */}
            {result && (
                <>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-stone-100">
                                    <th className="pb-3 text-left text-xs font-medium text-stone-400 pr-6 pl-4 sm:pl-0">
                                        <div className="flex items-center gap-1">
                                            Main Category
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
                                                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th className="pb-3 text-left text-xs font-medium text-stone-400 pr-6 hidden sm:table-cell">Subcategory</th>
                                    <th className="pb-3 text-left text-xs font-medium text-stone-400 pr-6 hidden md:table-cell">Example Products</th>
                                    <th className="pb-3 text-right text-xs font-medium text-stone-400 pr-4 sm:pr-0">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parents.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-16 text-center text-stone-400">
                                            No categories found
                                        </td>
                                    </tr>
                                ) : (
                                    parents.map((parent) => {
                                        const children = childrenOf(parent.id);
                                        return (
                                            <React.Fragment key={parent.id}>
                                                {/* Parent row */}
                                                <tr className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                                    <td className="py-3.5 pr-6 pl-4 sm:pl-0">
                                                        <span className="text-sm font-semibold text-stone-800">{parent.name}</span>
                                                    </td>
                                                    <td className="py-3.5 pr-6 hidden sm:table-cell">
                                                        <span className="text-sm text-stone-400">—</span>
                                                    </td>
                                                    <td className="py-3.5 pr-6 hidden md:table-cell">
                                                        <span className="text-sm text-stone-400">{parent.description ?? '—'}</span>
                                                    </td>
                                                    <td className="py-3.5 text-right pr-4 sm:pr-0">
                                                        {(canUpdate || canDelete) && (
                                                            <ActionMenu
                                                                onEdit={() => setModal({ edit: parent })}
                                                                onDelete={() => handleDelete(parent)}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                                {/* Children rows */}
                                                {children.map((child) => (
                                                    <tr key={child.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                                                        <td className="py-3.5 pr-6 pl-4 sm:pl-0">
                                                            <span className="text-sm text-stone-400"></span>
                                                        </td>
                                                        <td className="py-3.5 pr-6 hidden sm:table-cell">
                                                            <span className="text-sm text-stone-600">{child.name}</span>
                                                        </td>
                                                        <td className="py-3.5 pr-6 hidden md:table-cell">
                                                            <span className="text-sm text-stone-400">{child.description ?? '—'}</span>
                                                        </td>
                                                        <td className="py-3.5 text-right pr-4 sm:pr-0">
                                                            {(canUpdate || canDelete) && (
                                                                <ActionMenu
                                                                    onEdit={() => setModal({ edit: child })}
                                                                    onDelete={() => handleDelete(child)}
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {result.pagination.last_page > 1 && (
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                            <span className="text-xs text-stone-400">
                                Page {result.pagination.current_page} of {result.pagination.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="h-7 px-2 text-xs border-stone-200 text-stone-500 disabled:opacity-30"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === result.pagination.last_page}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="h-7 px-2 text-xs border-stone-200 text-stone-500 disabled:opacity-30"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {modal !== null && (
                <CategoryModal
                    mode={modal}
                    categories={allCategories}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}