import type { AxiosError } from 'axios';
import axios from 'axios';

export const client = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
});

client.interceptors.request.use((config) => {
    const xsrf = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (xsrf) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrf);
    }

    // Only set Content-Type to application/json if we're not sending FormData
    // When sending FormData, axios will automatically set the correct Content-Type with boundary
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
});

export function isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
}
