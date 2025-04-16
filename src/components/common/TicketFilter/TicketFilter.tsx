import { formatTicketStatus } from '../../../utils/formatters.tsx';
import './TicketFilter.css';
import {TicketStatus} from "../../../types";

interface TicketFilterProps {
    onFilterChange: (status: TicketStatus | 'ALL') => void;
    currentFilter: TicketStatus | 'ALL';
}

const TicketFilter = ({ onFilterChange, currentFilter }: TicketFilterProps) => {
    const handleFilterClick = (status: TicketStatus | 'ALL') => {
        onFilterChange(status);
    };

    return (
        <div className="ticket-filter">
            <h3 className="filter-title">Filter by Status</h3>
            <div className="filter-buttons">
                <button
                    className={`filter-button ${currentFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('ALL')}
                >
                    All Tickets
                </button>
                <button
                    className={`filter-button ${currentFilter === TicketStatus.OPENED ? 'active' : ''}`}
                    onClick={() => handleFilterClick(TicketStatus.OPENED)}
                >
                    {formatTicketStatus(TicketStatus.OPENED)}
                </button>
                <button
                    className={`filter-button ${currentFilter === TicketStatus.IN_PROGRESS ? 'active' : ''}`}
                    onClick={() => handleFilterClick(TicketStatus.IN_PROGRESS)}
                >
                    {formatTicketStatus(TicketStatus.IN_PROGRESS)}
                </button>
                <button
                    className={`filter-button ${currentFilter === TicketStatus.CLOSED ? 'active' : ''}`}
                    onClick={() => handleFilterClick(TicketStatus.CLOSED)}
                >
                    {formatTicketStatus(TicketStatus.CLOSED)}
                </button>
            </div>
        </div>
    );
};

export default TicketFilter;