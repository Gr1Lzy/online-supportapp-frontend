import {AdminUserResponseDto, Page, UserResponseDto, UserUpdateRequestDto} from "../../types";
import api from "../axiosConfig";

export const adminUserApi = {
    deleteUser: async (userId: string): Promise<void> => {
        await api.delete(`/admin/users/${userId}`);
    },

    getAllUsers: async (page: number = 0, size: number = 10): Promise<Page<AdminUserResponseDto>> => {
        const response =
            await api.get<Page<AdminUserResponseDto>>(`/users?page=${page}&size=${size}`);
        return response.data;
    },

    getUserById: async (userId: string): Promise<AdminUserResponseDto> => {
        const response =
            await api.get<AdminUserResponseDto>(`/admin/users/${userId}`);
        return response.data;
    },

    updateUser: async (userId: string, user: UserUpdateRequestDto): Promise<void> => {
        await api.put(`/admin/users/${userId}`, user);
    },
}