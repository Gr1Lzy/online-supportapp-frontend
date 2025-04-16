import clients from '../api/clients.ts';
import {PageDto, TicketRequestDto, TicketResponseDto} from "../../../types";

export const ticketService = {

    createTicket: async (ticket: TicketRequestDto): Promise<void> => {
        await clients.post<void>(`/api/tickets`, ticket);
    },

    getAll: async (page: number = 0, size: number = 10): Promise<PageDto<TicketResponseDto>> => {
        const response =
            await clients.get<PageDto<TicketResponseDto>>(`/api/tickets?page=${page}&size=${size}`);
        return response.data;
    },

    getByTicketId: async (ticketId: string): Promise<TicketResponseDto> => {
        const response =
            await clients.get<TicketResponseDto>(`/api/tickets/${ticketId}`);
        return response.data;
    },

    assignTicketOnCurrentUser: async (ticketId: string): Promise<void> => {
        await clients.patch(`/api/tickets/${ticketId}/assign-on-me`);
    },

    getMyCreatedTickets: async (page: number = 0, size: number = 10): Promise<PageDto<TicketResponseDto>> => {
        const response =
            await clients.get<PageDto<TicketResponseDto>>(`/api/tickets/my-created?page=${page}&size=${size}`);
        return response.data;
    },

    getMyAssignedTickets: async (page: number = 0, size: number = 10): Promise<PageDto<TicketResponseDto>> => {
        const response =
            await clients.get<PageDto<TicketResponseDto>>(`/api/tickets/my-assigned?page=${page}&size=${size}`);
        return response.data;
    }
};