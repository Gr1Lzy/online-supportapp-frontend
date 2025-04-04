import api from '../api.ts';
import {PageDto, TicketRequestDto, TicketResponseDto} from "../../types";

export const ticketService = {

    createTicket: async (ticket: TicketRequestDto): Promise<void> => {
        await api.post<void>(`/api/tickets`, ticket);
    },

    getAll: async (page: number = 0, size: number = 10): Promise<PageDto<TicketResponseDto>> => {
        const response =
            await api.get<PageDto<TicketResponseDto>>(`/api/tickets?page=${page}&size=${size}`);
        return response.data;
    },

    getByTicketId: async (ticketId: string): Promise<void> => {
        await api.get<PageDto<TicketRequestDto>>(`/api/tickets/${ticketId}`);
    },

    assignTicketOnCurrentUser: async (ticketId: string): Promise<void> => {
        await api.patch(`/api/tickets/${ticketId}`);
    }
};
