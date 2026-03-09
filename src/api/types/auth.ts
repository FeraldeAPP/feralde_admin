export interface User {
  id: number;
  name: string;
  email: string;
  account_type: string;
  email_verified_at: string | null;
  last_login_at: string | null;
  is_active: boolean;
  roles: Role[];
  permissions: Record<string, Record<string, string[]>>;
}

export interface Role {
  id: number;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  account_type: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: AdminUserRole[];
}

export interface AdminUserRole {
  id: number;
  name: string;
  permissions: Record<string, Record<string, string[]>>;
}

export interface RoleWithPermissions {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  permissions: Record<string, Record<string, string[]>>;
}

export interface Permission {
  id: number;
  permission: string;
  module: string[];
}

export interface UserListData {
  users: AdminUser[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_ids: number[];
}

export interface UpdateUserPayload {
  name: string;
  email: string;
}

export interface AssignRolesPayload {
  role_ids: number[];
}

export interface CreateRolePayload {
  name: string;
  slug: string;
  description: string;
  permissions: Record<string, string[]>;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
