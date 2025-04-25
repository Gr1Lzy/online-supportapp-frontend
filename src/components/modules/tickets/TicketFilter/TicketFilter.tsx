import { formatTicketStatus } from "../../../../utils/formatters";
import './TicketFilter.css';
import { TicketStatus } from "../../../../types";

type FilterOption = TicketStatus | 'ALL' | 'ARCHIVED';

interface TicketFilterProps {
    onFilterChange: (status: FilterOption) => void;
    currentFilter: FilterOption;
}

const TicketFilter = ({ onFilterChange, currentFilter }: TicketFilterProps) => {
    const handleFilterClick = (status: FilterOption) => {
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
                    All Active Tickets
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
                <button
                    className={`filter-button ${currentFilter === 'ARCHIVED' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('ARCHIVED')}
                >
                    Archived
                </button>
            </div>
        </div>
    );
};

export default TicketFilter;