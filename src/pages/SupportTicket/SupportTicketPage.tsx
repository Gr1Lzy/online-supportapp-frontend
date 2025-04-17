import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllTickets } from '../../store/slices/supportSlice';
import { AppDispatch, RootState } from '../../store';
import TicketGrid from '../../components/common/TicketGrid/TicketGrid';
import TicketFilter from '../../components/common/TicketFilter/TicketFilter';
import { TicketResponseDto, TicketStatus, UserRole } from '../../types';
import { formatTicketStatus } from '../../utils/formatters';
import { hasAnyRole } from '../../utils/jwtUtils';
import './SupportTicketPage.css';

const SupportTicketPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(12);

    const { allTickets, loading, error, hasNext } = useSelector((state: RootState) => state.support);
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

        dispatch(fetchAllTickets({ page: currentPage, size: pageSize }));
    }, [dispatch, isAuthenticated, navigate, currentPage, pageSize]);

    const filterTickets = (tickets: TicketResponseDto[] | undefined): TicketResponseDto[] => {
        if (!tickets) return [];

        if (statusFilter === 'ALL') {
            return tickets;
        }

        return tickets.filter(ticket => ticket.status === statusFilter);
    };

    const filteredTickets = filterTickets(allTickets);

    const handleFilterChange = (status: TicketStatus | 'ALL') => {
        setStatusFilter(status);
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

    return (
        <div className="support-ticket-container">
            <header className="support-header">
                <h1 className="support-title">Support Ticket Management</h1>
                <div className="header-actions">
                    <button className="back-button" onClick={handleBackToDashboard}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
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
                    {loading && allTickets.length === 0 ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    ) : isEmptyTickets ? (
                        <div className="empty-support">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3>No {statusFilter !== 'ALL' ? `${formatTicketStatus(statusFilter as TicketStatus)} ` : ''}tickets found</h3>
                            <p>
                                {statusFilter !== 'ALL'
                                    ? `No ${formatTicketStatus(statusFilter as TicketStatus).toLowerCase()} tickets are available. Try changing the filter.`
                                    : 'No tickets are currently available in the system.'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            <TicketGrid
                                tickets={filteredTickets}
                                title={`All Support Tickets ${statusFilter !== 'ALL'
                                    ? `(${formatTicketStatus(statusFilter as TicketStatus)})`
                                    : ''}`}
                                emptyMessage={`No ${statusFilter !== 'ALL'
                                    ? statusFilter.toLowerCase() + ' '
                                    : ''}tickets available`}
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