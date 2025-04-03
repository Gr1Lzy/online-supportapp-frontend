import api from '../axiosConfig';
import {Page, PasswordRequestDto, UserResponseDto} from "../../types";

export const userApi = {
    getCurrentUser: async (): Promise<UserResponseDto> => {
        const response =
            await api.get<UserResponseDto>('/users/me');
        return response.data;
    },

    getUserById: async (id: string): Promise<UserResponseDto> => {
        const response =
            await api.get<UserResponseDto>(`/users/${id}`);
        return response.data;
    },

    getAllUsers: async (page: number = 0, size: number = 10): Promise<Page<UserResponseDto>> => {
        const response =
            await api.get<Page<UserResponseDto>>(`/users?page=${page}&size=${size}`);
        return response.data;
    },

    updatePassword: async (passwordData: PasswordRequestDto): Promise<void> => {
        await api.patch('/users/update-password', passwordData);
    },
};
