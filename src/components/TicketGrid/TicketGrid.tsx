import { useNavigate } from 'react-router-dom';
import { TicketResponseDto } from '../../types';
import { TicketStatus } from '../../types/ticket-service/status/TicketStatus';
import { formatTicketStatus } from '../../utils/formatters';

interface TicketGridProps {
    tickets: TicketResponseDto[];
    title: string;
    emptyMessage: string;
    maxItems?: number;
}

const TicketGrid = ({ tickets, title, emptyMessage, maxItems = 6 }: TicketGridProps) => {
    const navigate = useNavigate();

    const filteredTickets = tickets
        .filter(ticket => ticket.status !== TicketStatus.CLOSED)
        .slice(0, maxItems);

    const handleViewTicket = (ticketId: string) => {
        navigate(`/tickets/${ticketId}`);
    };

    const getStatusClass = (status: TicketStatus) => {
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="ticket-section">
            <h2 className="section-title">{title}</h2>

            {filteredTickets.length > 0 ? (
                <div className="tickets-grid">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket.id}
                            className="ticket-card"
                            onClick={() => handleViewTicket(ticket.id)}
                        >
                            <div className={`ticket-status ${getStatusClass(ticket.status)}`}>
                                {formatTicketStatus(ticket.status)}
                            </div>
                            <h3 className="ticket-title">{ticket.title}</h3>
                            <div className="ticket-description">{ticket.description}</div>
                            <div className="ticket-footer">
                                <span>Created: {formatDate(ticket.created_at)}</span>
                                {ticket.assignee && (
                                    <span>Assignee: {ticket.assignee.username}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-tickets">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="no-tickets-message">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
};

export default TicketGrid;