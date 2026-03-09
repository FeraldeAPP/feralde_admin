import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getRoles, createUser, updateUser, deleteUser, assignUserRoles } from '@/api/endpoints';
import type { AdminUser, RoleWithPermissions, CreateUserPayload, UpdateUserPayload } from '@/api/types';

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; user: AdminUser }
  | { type: 'roles'; user: AdminUser }
  | { type: 'delete'; user: AdminUser };

export default function UsersPage(): React.ReactElement {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', search],
    queryFn: () => getUsers({ search: search || undefined }),
  });

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const roles: RoleWithPermissions[] =
    rolesData?.success ? rolesData.data : [];

  const result = data?.success ? data.data : null;

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setModal({ type: 'none' });
        setFormError(null);
      } else {
        setFormError(res.message);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setModal({ type: 'none' });
        setFormError(null);
      } else {
        setFormError(res.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setModal({ type: 'none' });
    },
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ id, roleIds }: { id: number; roleIds: number[] }) =>
      assignUserRoles(id, { role_ids: roleIds }),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setModal({ type: 'none' });
        setFormError(null);
      } else {
        setFormError(res.message);
      }
    },
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  function openAdd() {
    setFormError(null);
    setModal({ type: 'add' });
  }

  function closeModal() {
    setFormError(null);
    setModal({ type: 'none' });
  }

  return (
    <div className="p-6 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage user accounts and access permissions.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add User
        </button>
      </header>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          id="user-search"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-lg hover:bg-gray-50"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 px-4 py-16 text-center text-sm text-gray-400">
          Loading users...
        </div>
      )}

      {isError && (
        <div role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Failed to load users. Please try again.
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">User</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Roles</th>
                  <th className="px-5 py-3 text-left">Email Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  result.users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">ID #{user.id}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{user.email}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length === 0 ? (
                            <span className="text-gray-400 text-xs">No roles</span>
                          ) : (
                            user.roles.map((r) => (
                              <span
                                key={r.id}
                                className="inline-flex text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium"
                              >
                                {r.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {user.email_verified_at ? (
                          <span className="inline-flex text-xs px-2 py-0.5 rounded-full border border-emerald-400 text-emerald-600 font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-500 font-medium">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => { setFormError(null); setModal({ type: 'edit', user }); }}
                            className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => { setFormError(null); setModal({ type: 'roles', user }); }}
                            className="px-3 py-1.5 text-xs font-medium border border-indigo-300 text-indigo-600 rounded-md hover:bg-indigo-50"
                          >
                            Roles
                          </button>
                          <button
                            type="button"
                            onClick={() => setModal({ type: 'delete', user })}
                            className="px-3 py-1.5 text-xs font-medium border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal.type === 'add' && (
        <AddUserModal
          roles={roles}
          error={formError}
          isPending={createMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => createMutation.mutate(payload)}
        />
      )}

      {modal.type === 'edit' && (
        <EditUserModal
          user={modal.user}
          error={formError}
          isPending={updateMutation.isPending}
          onClose={closeModal}
          onSubmit={(payload) => updateMutation.mutate({ id: modal.user.id, payload })}
        />
      )}

      {modal.type === 'roles' && (
        <AssignRolesModal
          user={modal.user}
          roles={roles}
          error={formError}
          isPending={assignRolesMutation.isPending}
          onClose={closeModal}
          onSubmit={(roleIds) => assignRolesMutation.mutate({ id: modal.user.id, roleIds })}
        />
      )}

      {modal.type === 'delete' && (
        <DeleteUserModal
          user={modal.user}
          isPending={deleteMutation.isPending}
          onClose={closeModal}
          onConfirm={() => deleteMutation.mutate(modal.user.id)}
        />
      )}
    </div>
  );
}

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 id="add-user-title" className="text-lg font-bold text-gray-900 mb-1">Add New User</h2>
        <p className="text-sm text-gray-500 mb-5">Create a new admin user account.</p>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="add-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="add-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="add-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="add-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">Min 8 characters</p>
          </div>

          <div>
            <label htmlFor="add-password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              id="add-password-confirm"
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {roles.length > 0 && (
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-2">Assign Roles</legend>
              <div className="flex flex-wrap gap-4">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {role.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="flex justify-end gap-3 pt-2">
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
              {isPending ? 'Creating...' : 'Create User'}
            </button>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 id="edit-user-title" className="text-lg font-bold text-gray-900 mb-1">Edit User</h2>
        <p className="text-sm text-gray-500 mb-5">Update user account details.</p>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="edit-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="edit-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
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
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    user.roles.map((r) => r.id),
  );

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="roles-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 id="roles-modal-title" className="text-lg font-bold text-gray-900 mb-1">Assign Roles</h2>
        <p className="text-sm text-gray-500 mb-5">
          Update roles for <span className="font-medium">{user.name}</span>.
        </p>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset className="mb-6">
            <legend className="sr-only">Roles</legend>
            <div className="space-y-2">
              {roles.length === 0 ? (
                <p className="text-sm text-gray-400">No roles available.</p>
              ) : (
                roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{role.name}</span>
                    {role.slug && (
                      <span className="text-xs text-gray-400 font-mono">{role.slug}</span>
                    )}
                  </label>
                ))
              )}
            </div>
          </fieldset>

          <div className="flex justify-end gap-3">
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
              {isPending ? 'Saving...' : 'Save Roles'}
            </button>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 id="delete-user-title" className="text-lg font-bold text-gray-900 mb-2">Delete User</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{user.name}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
}
