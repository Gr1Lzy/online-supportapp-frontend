import clients from '../api/clients.ts';
import {AuthRequestDto, AuthResponseDto, UserCreateRequestDto} from "../../../types";

export const authApi = {

    login: async (loginData: AuthRequestDto): Promise<AuthResponseDto> => {
        const response =
            await clients.post<AuthResponseDto>('/api/auth/login', loginData);
        return response.data;
    },

    register: async (registerData: UserCreateRequestDto): Promise<void> => {
        await clients.post('/api/auth/register', registerData);
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponseDto> => {
        const response =
            await clients.post<AuthResponseDto>('/api/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response.data;
    },

    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
};
