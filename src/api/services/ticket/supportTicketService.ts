import clients from '../api/clients.ts';
import {StatusRequestDto, UserIdRequestDto} from "../../../types";

export const supportTicketService = {

    assignOnUser: async (ticketId: string, userId: UserIdRequestDto): Promise<void> => {
        await clients.patch(`/api/support/tickets/${ticketId}`, userId);
    },

    unassignUser: async (ticketId: string): Promise<void> => {
        await clients.patch(`/api/support/tickets/${ticketId}/unassign`);
    },

    updateStatus: async (ticketId: string, status: StatusRequestDto): Promise<void> => {
        await clients.patch(`/api/support/tickets/${ticketId}/status-update`, status);
    },
};