import clients from '../api/clients.ts';
import {AdminUserResponseDto, PageDto, RoleRequestDto, UserUpdateRequestDto} from "../../../types";

export const adminUserService = {

    updateUser: async (id: string): Promise<UserUpdateRequestDto> => {
        const response =
            await clients.patch<UserUpdateRequestDto>(`/user-service/api/admin/users/${id}`);
        return response.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await clients.delete<void>(`/user-service/api/admin/users/${id}`);
    },

    getAllUsers: async (page: number = 0, size: number = 10): Promise<PageDto<AdminUserResponseDto>> => {
        const response =
            await clients.get<PageDto<AdminUserResponseDto>>(`/user-service/api/admin/users?page=${page}&size=${size}`);
        return response.data;
    },

    getUserById: async (id: string): Promise<AdminUserResponseDto> => {
        const response =
            await clients.get<AdminUserResponseDto>(`/user-service/api/admin/users/${id}`);
        return response.data;
    },

    assignRole: async (id: string, role: RoleRequestDto): Promise<void> => {
        await clients.patch(`/api/admin/users${id}/roles`, role);
    },
};
