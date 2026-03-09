import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoles, getPermissions, createRole } from '@/api/endpoints';
import type { RoleWithPermissions, Permission, CreateRolePayload } from '@/api/types';

type ModalState = { type: 'none' } | { type: 'create' };
type ActiveTab = 'basic' | 'permissions';

export default function RolesPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [formError, setFormError] = useState<string | null>(null);

  const { data: rolesData, isLoading, isError } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const { data: permissionsData } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  const roles: RoleWithPermissions[] = rolesData?.success ? rolesData.data : [];
  const permissions: Permission[] = permissionsData?.success ? permissionsData.data : [];

  const createMutation = useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['roles'] });
        setModal({ type: 'none' });
        setFormError(null);
      } else {
        setFormError(res.message);
      }
    },
  });

  function openCreate() {
    setFormError(null);
    setModal({ type: 'create' });
  }

  function closeModal() {
    setFormError(null);
    setModal({ type: 'none' });
  }

  function getPermissionSlugList(rolePermissions: Record<string, Record<string, string[]>>): string[] {
    return Object.values(rolePermissions)
      .flatMap((group) => Object.values(group))
      .flat();
  }

  return (
    <div className="p-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Define access levels and capabilities for your users.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Create Role
        </button>
      </header>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading roles...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load roles. Please try again.
        </div>
      )}

      {rolesData?.success && (
        <div className="space-y-3">
          {roles.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
              No roles found
            </div>
          ) : (
            roles.map((role, index) => {
              const slugList = getPermissionSlugList(role.permissions);
              return (
                <div key={role.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{role.name}</span>
                      <span className="inline-flex text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                        {role.slug}
                      </span>
                    </div>
                    {slugList.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {slugList.map((perm) => (
                          <span
                            key={perm}
                            className="inline-flex text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-600 bg-gray-50"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No permissions</p>
                    )}
                    {role.description && (
                      <p className="text-xs text-gray-500 mt-1.5">{role.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">#{index + 1}</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {modal.type === 'create' && (
        <CreateRoleModal
          permissions={permissions}
          error={formError}
          isPending={createMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => createMutation.mutate(payload)}
        />
      )}
    </div>
  );
}

interface PermissionGroup {
  label: string;
  module: string;
  permissions: Permission[];
}

function groupPermissionsByModule(permissions: Permission[]): PermissionGroup[] {
  const groups: Record<string, Permission[]> = {};
  for (const perm of permissions) {
    const module = Array.isArray(perm.module) ? perm.module[0] ?? 'other' : 'other';
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(perm);
  }
  return Object.entries(groups).map(([module, perms]) => ({
    label: module.charAt(0).toUpperCase() + module.slice(1).replace(/-/g, ' '),
    module,
    permissions: perms,
  }));
}

interface CreateRoleModalProps {
  permissions: Permission[];
  error: string | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRolePayload) => void;
}

function CreateRoleModal({ permissions, error, isPending, onClose, onSubmit }: CreateRoleModalProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<ActiveTab>('basic');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set());

  const groups = groupPermissionsByModule(permissions);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  }

  function togglePerm(perm: string) {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) {
        next.delete(perm);
      } else {
        next.add(perm);
      }
      return next;
    });
  }

  function isModuleAllSelected(group: PermissionGroup): boolean {
    return group.permissions.every((p) => selectedPerms.has(p.permission));
  }

  function toggleModule(group: PermissionGroup) {
    const allSelected = isModuleAllSelected(group);
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      for (const p of group.permissions) {
        if (allSelected) {
          next.delete(p.permission);
        } else {
          next.add(p.permission);
        }
      }
      return next;
    });
  }

  function isAllSelected(): boolean {
    return permissions.length > 0 && permissions.every((p) => selectedPerms.has(p.permission));
  }

  function toggleAll() {
    const allSelected = isAllSelected();
    setSelectedPerms(() => {
      if (allSelected) return new Set();
      return new Set(permissions.map((p) => p.permission));
    });
  }

  function buildPermissionsPayload(): Record<string, string[]> {
    const payload: Record<string, string[]> = {};
    for (const perm of permissions) {
      if (selectedPerms.has(perm.permission)) {
        const module = Array.isArray(perm.module) ? perm.module[0] ?? 'other' : 'other';
        if (!payload[module]) payload[module] = [];
        payload[module].push(perm.permission);
      }
    }
    return payload;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      slug,
      description,
      permissions: buildPermissionsPayload(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-role-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        <div className="p-6 pb-0">
          <h2 id="create-role-title" className="text-lg font-bold text-gray-900 mb-0.5">Create New Role</h2>
          <p className="text-sm text-gray-500 mb-4">Create a new role and assign permissions to it</p>

          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex border-b border-gray-200 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('permissions')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'permissions'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Permissions
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="role-name"
                    type="text"
                    required
                    placeholder="e.g., HR Manager"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="role-slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="role-slug"
                    type="text"
                    required
                    placeholder="e.g., hr-manager"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    pattern="[a-z0-9-]+"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Lowercase alphanumeric with hyphens only</p>
                </div>

                <div>
                  <label htmlFor="role-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="role-description"
                    rows={3}
                    placeholder="Role description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Permissions</span>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected()}
                      onChange={toggleAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Select all
                  </label>
                </div>

                {groups.length === 0 ? (
                  <p className="text-sm text-gray-400 py-8 text-center">No permissions available.</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {groups.map((group) => (
                      <section key={group.module} className="border-b border-gray-100 last:border-b-0">
                        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            {group.label}
                          </h3>
                          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isModuleAllSelected(group)}
                              onChange={() => toggleModule(group)}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Select all {group.label}
                          </label>
                        </div>
                        <div className="px-4 py-3 space-y-2">
                          {group.permissions.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedPerms.has(perm.permission)}
                                onChange={() => togglePerm(perm.permission)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              {formatPermissionLabel(perm.permission)}
                            </label>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatPermissionLabel(permission: string): string {
  return permission
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
