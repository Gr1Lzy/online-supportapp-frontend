import React from 'react';
import Badge from '../../ui/Badge/Badge';
import { TicketStatus } from '../../../types';

interface StatusBadgeProps {
    status: TicketStatus;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    pill?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                     status,
                                                     className = '',
                                                     size = 'md',
                                                     pill = true,
                                                 }) => {
    const getStatusConfig = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.OPENED:
                return {
                    variant: 'success' as const,
                    text: 'Opened',
                };
            case TicketStatus.IN_PROGRESS:
                return {
                    variant: 'warning' as const,
                    text: 'In Progress',
                };
            case TicketStatus.CLOSED:
                return {
                    variant: 'danger' as const,
                    text: 'Closed',
                };
            default:
                return {
                    variant: 'neutral' as const,
                    text: status,
                };
        }
    };

    const { variant, text } = getStatusConfig(status);

    return (
        <Badge
            variant={variant}
            size={size}
            pill={pill}
            className={className}
        >
            {text}
        </Badge>
    );
};

export default StatusBadge;