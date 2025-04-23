import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../ui/Card/Card';
import Avatar from '../../../ui/Avatar/Avatar';
import StatusBadge from '../../../common/StatusBadge/StatusBadge';
import { TicketResponseDto } from '../../../../types';
import { formatDateTime } from '../../../../utils/dateUtils';
import './TicketItem.css';

interface TicketItemProps {
    ticket: TicketResponseDto;
    onClick?: (ticketId: string) => void;
    className?: string;
}

const TicketItem: React.FC<TicketItemProps> = ({
                                                   ticket,
                                                   onClick,
                                                   className = '',
                                               }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(ticket.id);
        } else {
            navigate(`/tickets/${ticket.id}`);
        }
    };

    const truncateText = (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return `${text.substring(0, maxLength)}...`;
    };

    return (
        <Card
            className={`ticket-item ${className}`}
            interactive={true}
            onClick={handleClick}
        >
            <div className="ticket-item-status">
                <StatusBadge status={ticket.status} />
            </div>

            <h3 className="ticket-item-title">
                {truncateText(ticket.title, 50)}
            </h3>

            <div className="ticket-item-description">
                {truncateText(ticket.description, 100)}
            </div>

            <div className="ticket-item-footer">
                <div className="ticket-item-meta">
          <span className="ticket-item-date">
            {formatDateTime(ticket.created_at)}
          </span>
                </div>

                {ticket.assignee && (
                    <div className="ticket-item-assignee">
                        <span className="ticket-item-assignee-label">Assigned to:</span>
                        <div className="ticket-item-assignee-info">
                            <Avatar
                                name={ticket.assignee.username}
                                size="xs"
                            />
                            <span className="ticket-item-assignee-name">
                {ticket.assignee.username}
              </span>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TicketItem;