import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllTickets, fetchAllArchivedTickets } from '../../store/slices/supportSlice';
import { AppDispatch, RootState } from '../../store';
import TicketGrid from '../../components/modules/tickets/TicketGrid/TicketGrid';
import TicketFilter from '../../components/modules/tickets/TicketFilter/TicketFilter';
import { TicketResponseDto, TicketStatus, UserRole } from '../../types';
import { formatTicketStatus } from '../../utils/formatters';
import { hasAnyRole } from '../../utils/jwtUtils';
import './SupportTicketPage.css';
import Button from "../../components/ui/Button/Button.tsx";

type FilterOption = TicketStatus | 'ALL' | 'ARCHIVED';

const SupportTicketPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState<FilterOption>('ALL');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(12);

    const { allTickets, archivedTickets, loading, error, hasNext } = useSelector((state: RootState) => state.support);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        const isSupport = hasAnyRole([UserRole.SUPPORT, UserRole.ADMIN]);

        if (!isSupport) {
            navigate('/dashboard');
            return;
        }

        if (statusFilter === 'ARCHIVED') {
            dispatch(fetchAllArchivedTickets({ page: currentPage, size: pageSize }));
        } else {
            dispatch(fetchAllTickets({ page: currentPage, size: pageSize }));
        }
    }, [dispatch, isAuthenticated, navigate, currentPage, pageSize, statusFilter]);

    const filterTickets = (tickets: TicketResponseDto[] | undefined): TicketResponseDto[] => {
        if (!tickets) return [];

        if (statusFilter === 'ARCHIVED') {
            return tickets;
        }

        if (statusFilter === 'ALL') {
            return tickets;
        }

        return tickets.filter(ticket => ticket.status === statusFilter);
    };

    const ticketsToDisplay = statusFilter === 'ARCHIVED' ? archivedTickets : allTickets;
    const filteredTickets = filterTickets(ticketsToDisplay);

    const handleFilterChange = (status: FilterOption) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const loadMoreTickets = () => {
        if (hasNext) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const isEmptyTickets = !filteredTickets?.length;

    const getFilterTitle = () => {
        if (statusFilter === 'ARCHIVED') {
            return 'Archived Support Tickets';
        }

        if (statusFilter === 'ALL') {
            return 'All Active Support Tickets';
        }

        return `Support Tickets (${formatTicketStatus(statusFilter as TicketStatus)})`;
    };

    const getEmptyMessage = () => {
        if (statusFilter === 'ALL') {
            return 'No active tickets are currently available in the system.';
        }

        if (statusFilter === 'ARCHIVED') {
            return 'No archived tickets found. Tickets are automatically archived after 2 weeks.';
        }

        return `No ${formatTicketStatus(statusFilter as TicketStatus).toLowerCase()} tickets are available. Try changing the filter.`;
    };

    return (
        <div className="support-ticket-container">
            <header className="support-header">
                <h1 className="support-title">Support Ticket Management</h1>
                <div className="header-actions">
                    <Button
                        variant="outline"
                        onClick={handleBackToDashboard}
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            <div className="support-main">
                <aside className="support-sidebar">
                    <TicketFilter
                        onFilterChange={handleFilterChange}
                        currentFilter={statusFilter}
                    />
                </aside>

                <main className="support-content">
                    {loading && ticketsToDisplay.length === 0 ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            {error}
                        </div>
                    ) : isEmptyTickets ? (
                        <div className="empty-support">
                            <h3>No tickets found</h3>
                            <p>{getEmptyMessage()}</p>
                        </div>
                    ) : (
                        <>
                            <TicketGrid
                                tickets={filteredTickets}
                                title={getFilterTitle()}
                                emptyMessage={getEmptyMessage()}
                            />

                            {hasNext && (
                                <div className="load-more-container">
                                    <button
                                        className="load-more-button"
                                        onClick={loadMoreTickets}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="loading-spinner-small"></span>
                                                Loading...
                                            </>
                                        ) : (
                                            'Load More Tickets'
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default SupportTicketPage;