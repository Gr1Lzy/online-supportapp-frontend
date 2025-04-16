import {TicketStatus} from "../types";

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

export const getStatusClassName = (status: TicketStatus): string => {
    switch (status) {
        case TicketStatus.OPENED:
            return 'status-opened';
        case TicketStatus.IN_PROGRESS:
            return 'status-in-progress';
        case TicketStatus.CLOSED:
            return 'status-closed';
        default:
            return '';
    }
};