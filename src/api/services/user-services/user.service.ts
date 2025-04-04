import api from '../api.ts';
import {PageDto, PasswordRequestDto, UserResponseDto} from "../../../types";

export const userService = {

    getCurrentUser: async (): Promise<UserResponseDto> => {
        const response =
            await api.get<UserResponseDto>('/user-service/api/users/me');
        return response.data;
    },

    getUserById: async (id: string): Promise<UserResponseDto> => {
        const response =
            await api.get<UserResponseDto>(`/user-service/api/users/${id}`);
        return response.data;
    },

    getAllUsers: async (page: number = 0, size: number = 10): Promise<PageDto<UserResponseDto>> => {
        const response =
            await api.get<PageDto<UserResponseDto>>(`/user-service/api/users?page=${page}&size=${size}`);
        return response.data;
    },

    updatePassword: async (passwordData: PasswordRequestDto): Promise<void> => {
        await api.patch('/user-service/api/users/update-password', passwordData);
    },
};