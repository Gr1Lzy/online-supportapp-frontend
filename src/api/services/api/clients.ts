import axios from 'axios';
import { index } from "../../../store";
import { logout, refreshToken } from '../../../store/slices/authSlice.ts';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const clients = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

clients.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: {resolve: (value: unknown) => void; reject: (reason?: any) => void}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

clients.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/refresh') ||
            originalRequest.url?.includes('/login')) {
            index.dispatch(logout());
            window.location.href = '/';
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return clients(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const result = await index.dispatch(refreshToken()).unwrap();
                const token = result.access_token;

                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                processQueue(null, token);

                isRefreshing = false;
                return clients(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                index.dispatch(logout());
                window.location.href = '/';
                isRefreshing = false;
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default clients;