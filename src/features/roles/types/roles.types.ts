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

export interface CreateRolePayload {
    name: string;
    slug: string;
    description: string;
    permissions: Record<string, string[]>;
}
