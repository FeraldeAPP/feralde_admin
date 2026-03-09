import type { AdminUserRole } from '@/features/roles/types';

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
