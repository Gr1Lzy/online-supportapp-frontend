import { formatTicketStatus, getStatusClassName } from '../../../utils/formatters';
import './StatusBadge.css';
import {TicketStatus} from "../../../types";

interface StatusBadgeProps {
    status: TicketStatus;
    className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
    return (
        <div className={`status-badge ${getStatusClassName(status)} ${className}`}>
            {formatTicketStatus(status)}
        </div>
    );
};

export default StatusBadge;