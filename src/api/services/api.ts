import axios from 'axios';
import { store } from "../../redux/store";
import { logout, refreshToken } from '../../redux/slices/authSlice';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const result = await store.dispatch(refreshToken()).unwrap();

                originalRequest.headers['Authorization'] = `Bearer ${result.access_token}`;

                return api(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;