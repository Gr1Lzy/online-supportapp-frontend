import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { fetchCurrentUser } from '../../redux/slices/userSlice';
import { fetchTickets } from '../../redux/slices/ticketSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { TicketStatus } from '../../types/ticket-service/status/TicketStatus';
import TicketFilter from '../../components/TicketFilter/TicketFilter';
import { formatTicketStatus } from '../../utils/formatters';
import './DashboardPage.css';

const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.user);
    const { tickets, loading: ticketsLoading } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCurrentUser());
            dispatch(fetchTickets({}));
        } else {
            navigate('/');
        }
    }, [dispatch, isAuthenticated, navigate]);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    const handleCreateTicket = () => {
        navigate('/create-ticket');
    };

    const handleViewTicket = (ticketId: string) => {
        navigate(`/tickets/${ticketId}`);
    };

    const handleFilterChange = (status: TicketStatus | 'ALL') => {
        setStatusFilter(status);
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

    // Filter tickets based on selected status
    const filteredTickets = useMemo(() => {
        if (!tickets) return [];

        if (statusFilter === 'ALL') {
            return tickets;
        }

        return tickets.filter(ticket => ticket.status === statusFilter);
    }, [tickets, statusFilter]);

    // Calculate ticket statistics
    const ticketStats = useMemo(() => {
        if (!tickets) return { total: 0, opened: 0, inProgress: 0, closed: 0 };

        return {
            total: tickets.length,
            opened: tickets.filter(t => t.status === TicketStatus.OPENED).length,
            inProgress: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
            closed: tickets.filter(t => t.status === TicketStatus.CLOSED).length,
        };
    }, [tickets]);

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!currentUser) return '';

        const firstInitial = currentUser.first_name ? currentUser.first_name.charAt(0).toUpperCase() : '';
        const lastInitial = currentUser.last_name ? currentUser.last_name.charAt(0).toUpperCase() : '';

        return firstInitial + lastInitial || currentUser.username.charAt(0).toUpperCase();
    };

    // Helper to get formatted status name for the page title
    const getFilterTitle = (filter: TicketStatus | 'ALL'): string => {
        if (filter === 'ALL') return 'Your Support Tickets';
        return `Your ${formatTicketStatus(filter)} Tickets`;
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Support Dashboard</h1>
                <div className="header-actions">
                    <button className="button button-secondary" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {userLoading || ticketsLoading ? (
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="dashboard-main">
                    {/* Sidebar with user profile */}
                    <aside className="dashboard-sidebar">
                        <div className="user-profile-card">
                            <div className="user-profile-header">
                                <div className="user-avatar">
                                    {getUserInitials()}
                                </div>
                                <div>
                                    <div className="user-name">
                                        {currentUser?.first_name && currentUser?.last_name
                                            ? `${currentUser.first_name} ${currentUser.last_name}`
                                            : currentUser?.username || 'User'}
                                    </div>
                                    <div className="user-email">{currentUser?.email}</div>
                                </div>
                            </div>

                            <div className="user-info-list">
                                <div className="user-info-item">
                                    <span className="info-label">Username</span>
                                    <span className="info-value">{currentUser?.username}</span>
                                </div>
                            </div>
                        </div>

                        <button onClick={handleCreateTicket} className="create-ticket-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New Ticket
                        </button>
                    </aside>

                    {/* Main content */}
                    <main className="dashboard-content">
                        {/* Stats cards */}
                        <div className="stats-cards">
                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-tickets">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{ticketStats.total}</div>
                                <div className="stat-card-title">Total Tickets</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-open">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{ticketStats.opened}</div>
                                <div className="stat-card-title">Open Tickets</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-progress">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{ticketStats.inProgress}</div>
                                <div className="stat-card-title">In Progress</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-closed">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{ticketStats.closed}</div>
                                <div className="stat-card-title">Closed Tickets</div>
                            </div>
                        </div>

                        {/* Ticket filter */}
                        <TicketFilter
                            onFilterChange={handleFilterChange}
                            currentFilter={statusFilter}
                        />

                        {/* Tickets section */}
                        <div>
                            <div className="content-header">
                                <h2>{getFilterTitle(statusFilter)}</h2>
                            </div>

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
                                    <p className="no-tickets-message">
                                        {statusFilter === 'ALL'
                                            ? 'You haven\'t created any tickets yet.'
                                            : `You don't have any ${formatTicketStatus(statusFilter).toLowerCase()} tickets.`}
                                    </p>
                                    <button onClick={handleCreateTicket} className="button">Create Your First Ticket</button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;