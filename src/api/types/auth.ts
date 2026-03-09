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
