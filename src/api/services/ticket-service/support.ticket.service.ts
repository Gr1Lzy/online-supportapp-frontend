import api from '../api.ts';
import {AdminUserResponseDto, PageDto, StatusRequestDto, UserIdRequestDto, UserUpdateRequestDto} from "../../../types";

export const supportTicketService = {

    assignOnUser: async (ticketId: string, userId: UserIdRequestDto): Promise<void> => {
        await api.patch<UserUpdateRequestDto>(`/api/support/tickets/${ticketId}`, userId);
    },

    unassignUser: async (ticketId: string): Promise<void> => {
        await api.patch<void>(`/api/support/tickets/${ticketId}`);
    },

    updateStatus: async (ticketId: string, status: StatusRequestDto): Promise<void> => {
        await api.patch<PageDto<AdminUserResponseDto>>(`/api/support/tickets/${ticketId}/status-update`, status);
    }
};
