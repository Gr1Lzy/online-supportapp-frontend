import React from 'react';
import { TicketResponseDto } from '../../../../types';
import TicketItem from '../TicketItem/TicketItem';
import './TicketGrid.css';

interface TicketGridProps {
    tickets: TicketResponseDto[];
    title?: string;
    emptyMessage?: string;
    maxItems?: number;
    onTicketClick?: (ticketId: string) => void;
    className?: string;
}

const TicketGrid: React.FC<TicketGridProps> = ({
                                                   tickets,
                                                   title,
                                                   emptyMessage = 'No tickets found',
                                                   maxItems,
                                                   onTicketClick,
                                                   className = '',
                                               }) => {
    const displayedTickets = maxItems ? tickets.slice(0, maxItems) : tickets;

    return (
        <div className={`ticket-grid-container ${className}`}>
            {title && (
                <h2 className="ticket-grid-title">{title}</h2>
            )}

            {displayedTickets.length > 0 ? (
                <div className="ticket-grid">
                    {displayedTickets.map(ticket => (
                        <TicketItem
                            key={ticket.id}
                            ticket={ticket}
                            onClick={onTicketClick}
                            className={`ticket-item-${ticket.status.toLowerCase()}`}
                        />
                    ))}
                </div>
            ) : (
                <div className="ticket-grid-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="ticket-grid-empty-message">{emptyMessage}</p>
                </div>
            )}
        </div>
    );
};

export default TicketGrid;