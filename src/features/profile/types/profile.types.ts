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
