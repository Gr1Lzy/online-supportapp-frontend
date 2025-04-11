import {TicketStatus} from "../types/ticket-service/status/TicketStatus.ts";

export const formatTicketStatus = (status: TicketStatus): string => {
    switch (status) {
        case TicketStatus.OPENED:
            return 'Opened';
        case TicketStatus.IN_PROGRESS:
            return 'In Progress';
        case TicketStatus.CLOSED:
            return 'Closed';
        default:
            return status;
    }
};