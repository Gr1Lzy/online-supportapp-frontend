import clients from '../api/clients.ts';
import {AdminUserResponseDto, PageDto, RoleRequestDto, UserUpdateRequestDto} from "../../../types";

export const adminUserService = {

    updateUser: async (id: string, userData: UserUpdateRequestDto): Promise<void> => {
        await clients.patch<void>(`/api/admin/users/${id}`, userData);
    },

    deleteUser: async (id: string): Promise<void> => {
        await clients.delete<void>(`/api/admin/users/${id}`);
    },

    getAllUsers: async (page: number = 0, size: number = 10): Promise<PageDto<AdminUserResponseDto>> => {
        const response =
            await clients.get<PageDto<AdminUserResponseDto>>(`/api/admin/users?page=${page}&size=${size}`);
        return response.data;
    },

    getUserById: async (id: string): Promise<AdminUserResponseDto> => {
        const response =
            await clients.get<AdminUserResponseDto>(`/api/admin/users/${id}`);
        return response.data;
    },

    assignRole: async (id: string, role: RoleRequestDto): Promise<void> => {
        await clients.patch(`/api/admin/users/${id}/roles`, role);
    },
};