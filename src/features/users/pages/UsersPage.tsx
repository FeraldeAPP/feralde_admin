import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUsers, useUserMutations } from '../hooks/use-users';
import { getRoles } from '@/features/roles/api';
import type { AdminUser, CreateUserPayload, UpdateUserPayload, UserFilters } from '../types';
import type { RoleWithPermissions } from '@/features/roles/types';
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
  CheckListIcon,
  Cancel01Icon,
  Settings01Icon,
  Delete02Icon,
  UserEdit01Icon,
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

const columnHelper = createColumnHelper<AdminUser>();

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; user: AdminUser }
  | { type: 'roles'; user: AdminUser }
  | { type: 'delete'; user: AdminUser };

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [formError, setFormError] = useState<string | null>(null);

  const filters: UserFilters = {
    per_page: 15,
    page,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
  };

  const { data, isLoading, isError } = useUsers(filters);
  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    assignRolesMutation,
  } = useUserMutations();

  const roles: RoleWithPermissions[] = rolesData?.success ? rolesData.data : [];
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
    columnHelper.accessor('name', {
      header: () => (
        <div className="flex items-center gap-1">
          User Name
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-300">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      ),
      cell: (info) => (
        <div className="flex flex-col">
          <p className="font-medium text-stone-900">{info.getValue()}</p>
          <p className="text-xs text-stone-400">ID #{info.row.original.id}</p>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email Address',
      cell: (info) => <span className="text-sm text-stone-500">{info.getValue()}</span>,
    }),
    columnHelper.accessor('roles', {
      header: 'Roles',
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {info.getValue().length === 0 ? (
            <span className="text-stone-400 text-xs">—</span>
          ) : (
            info.getValue().map((r: any) => (
              <span
                key={r.id}
                className="inline-flex text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium whitespace-nowrap"
              >
                {r.name}
              </span>
            ))
          )}
        </div>
      ),
    }),
    columnHelper.accessor('email_verified_at', {
      id: 'status',
      header: () => <div className="text-center">Status</div>,
      cell: (info) => (
        <div className="text-center">
          {info.getValue() ? (
            <span className="inline-flex text-[10px] px-2 py-0.5 rounded-full border border-emerald-400 text-emerald-600 font-bold uppercase tracking-wider">
              Verified
            </span>
          ) : (
            <span className="inline-flex text-[10px] px-2 py-0.5 rounded-full border border-stone-300 text-stone-400 font-bold uppercase tracking-wider">
              Unverified
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      cell: (info) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-stone-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => { setFormError(null); setModal({ type: 'edit', user: info.row.original }); }}
              >
                <HugeiconsIcon icon={UserEdit01Icon} size={14} />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => { setFormError(null); setModal({ type: 'roles', user: info.row.original }); }}
              >
                <HugeiconsIcon icon={Settings01Icon} size={14} />
                Assign Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 cursor-pointer flex items-center gap-2"
                onClick={() => setModal({ type: 'delete', user: info.row.original })}
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: result?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleExport = (format: 'pdf' | 'docx' | 'svg' | 'html') => {
    console.log(`Exporting as ${format}`);
  };

  const closeModal = () => {
    setFormError(null);
    setModal({ type: 'none' });
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const lastUpdated = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

  const TABS = [
    { label: 'All Users', value: 'all' as const, icon: UserGroupIcon },
    { label: 'Verified', value: 'verified' as const, icon: CheckListIcon },
    { label: 'Unverified', value: 'unverified' as const, icon: Cancel01Icon },
  ];

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
      <h1 className="text-xl sm:text-2xl font-bold text-stone-900">User Management</h1>

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
            placeholder="Search users..."
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
            variant="default"
            size="sm"
            onClick={() => { setFormError(null); setModal({ type: 'add' }); }}
            className="bg-stone-900 text-white hover:bg-stone-700 flex items-center gap-1.5"
          >
            <span className="hidden sm:inline">Add User</span>
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
            <DropdownMenuContent align="start" side="bottom" className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-0">
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Name')}>By Name</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Email')}>By Email</DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-stone-600 cursor-pointer py-1" onClick={() => setActiveFilter('By Role')}>By Role</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-16 text-center text-sm text-stone-400">
          Loading users...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load users. Please try again.
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
                                                    ${header.id === 'name' ? 'pl-4 sm:pl-0' : ''}
                                                    ${header.id === 'email' ? 'hidden sm:table-cell' : ''}
                                                    ${header.id === 'roles' ? 'hidden md:table-cell' : ''}
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
                      No users found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className={`py-3.5 pr-6 
                                                        ${cell.column.id === 'email' ? 'hidden sm:table-cell' : ''}
                                                        ${cell.column.id === 'roles' ? 'hidden md:table-cell' : ''}
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

      {/* Modals */}
      {modal.type === 'add' && (
        <AddUserModal
          roles={roles}
          error={formError}
          isPending={createMutation.isPending}
          onClose={closeModal}
          onSubmit={async (payload) => {
            const res = await createMutation.mutateAsync(payload);
            if (res.success) closeModal();
            else setFormError(res.message);
          }}
        />
      )}

      {modal.type === 'edit' && (
        <EditUserModal
          user={modal.user}
          error={formError}
          isPending={updateMutation.isPending}
          onClose={closeModal}
          onSubmit={async (payload) => {
            const res = await updateMutation.mutateAsync({ id: modal.user.id, payload });
            if (res.success) closeModal();
            else setFormError(res.message);
          }}
        />
      )}

      {modal.type === 'roles' && (
        <AssignRolesModal
          user={modal.user}
          roles={roles}
          error={formError}
          isPending={assignRolesMutation.isPending}
          onClose={closeModal}
          onSubmit={async (role_ids) => {
            const res = await assignRolesMutation.mutateAsync({ id: modal.user.id, payload: { role_ids } });
            if (res.success) closeModal();
            else setFormError(res.message);
          }}
        />
      )}

      {modal.type === 'delete' && (
        <DeleteUserModal
          user={modal.user}
          isPending={deleteMutation.isPending}
          onClose={closeModal}
          onConfirm={async () => {
            await deleteMutation.mutateAsync(modal.user.id);
            closeModal();
          }}
        />
      )}
    </div>
  );
}

// Modal Components (kept from original but using better styling where needed)

interface AddUserModalProps {
  roles: RoleWithPermissions[];
  error: string | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateUserPayload) => void;
}

function AddUserModal({ roles, error, isPending, onClose, onSubmit }: AddUserModalProps): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  function toggleRole(id: number) {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      role_ids: selectedRoleIds,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 border border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 mb-1">Add New User</h2>
        <p className="text-sm text-stone-500 mb-5">Create a new admin user account.</p>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Full name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} className="border-stone-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-stone-200" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="border-stone-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
              <Input type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="border-stone-200" />
            </div>
          </div>

          {roles.length > 0 && (
            <fieldset>
              <legend className="text-sm font-medium text-stone-700 mb-2">Assign Roles</legend>
              <div className="flex flex-wrap gap-3">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer p-2 rounded-lg border border-stone-100 hover:bg-stone-50">
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                    />
                    {role.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-stone-900 text-white hover:bg-stone-700">
              {isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditUserModalProps {
  user: AdminUser;
  error: string | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateUserPayload) => void;
}

function EditUserModal({ user, error, isPending, onClose, onSubmit }: EditUserModalProps): React.ReactElement {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, email });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 border border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 mb-1">Edit User</h2>
        <p className="text-sm text-stone-500 mb-5">Update user account details.</p>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Full name</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} className="border-stone-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="border-stone-200" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-stone-900 text-white hover:bg-stone-700">
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AssignRolesModalProps {
  user: AdminUser;
  roles: RoleWithPermissions[];
  error: string | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (roleIds: number[]) => void;
}

function AssignRolesModal({ user, roles, error, isPending, onClose, onSubmit }: AssignRolesModalProps): React.ReactElement {
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(user.roles.map((r) => r.id));

  function toggleRole(id: number) {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(selectedRoleIds);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 border border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 mb-1">Assign Roles</h2>
        <p className="text-sm text-stone-500 mb-5">Update roles for <span className="font-semibold">{user.name}</span>.</p>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {roles.length === 0 ? (
              <p className="text-sm text-stone-400">No roles available.</p>
            ) : (
              roles.map((role) => (
                <label key={role.id} className="flex items-center gap-3 p-3 rounded-lg border border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                  />
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{role.name}</p>
                    {role.slug && <p className="text-[10px] text-stone-400 font-mono uppercase">{role.slug}</p>}
                  </div>
                </label>
              ))
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-stone-900 text-white hover:bg-stone-700">
              {isPending ? 'Saving...' : 'Save Roles'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteUserModalProps {
  user: AdminUser;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteUserModal({ user, isPending, onClose, onConfirm }: DeleteUserModalProps): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 border border-stone-100 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <HugeiconsIcon icon={Delete02Icon} size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-stone-900 mb-2">Delete User</h2>
        <p className="text-sm text-stone-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-stone-900">{user.name}</span>? This action is permanent and cannot be undone.
        </p>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="button" onClick={onConfirm} disabled={isPending} className="flex-1 bg-red-600 text-white hover:bg-red-700">
            {isPending ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}


