import type { AxiosError } from 'axios';
import axios from 'axios';

export const authClient = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL || '/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

authClient.interceptors.request.use((config) => {
    const xsrf = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (xsrf) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrf);
    }

    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
});

export function isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
}
