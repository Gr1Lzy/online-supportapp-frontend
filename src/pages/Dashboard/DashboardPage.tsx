import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {logout} from '../../store/slices/authSlice';
import {fetchCurrentUser} from '../../store/slices/userSlice';
import {fetchMyAssignedTickets, fetchMyCreatedTickets} from '../../store/slices/ticketSlice';
import {AppDispatch, RootState} from '../../store';
import TicketGrid from '../../components/common/TicketGrid/TicketGrid';
import TicketFilter from '../../components/common/TicketFilter/TicketFilter';
import {TicketResponseDto, TicketStatus} from '../../types';
import {formatTicketStatus} from '../../utils/formatters';
import './DashboardPage.css';

const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');

    const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.user);
    const {
        myAssignedTickets,
        myCreatedTickets,
        loading: ticketsLoading
    } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCurrentUser());
            dispatch(fetchMyAssignedTickets({ size: 50 }));
            dispatch(fetchMyCreatedTickets({ size: 50 }));
        } else {
            navigate('/');
        }
    }, [dispatch, isAuthenticated, navigate]);

    const filterTickets = (tickets: TicketResponseDto[] | undefined): TicketResponseDto[] => {
        if (!tickets) return [];

        if (statusFilter === 'ALL') {
            return tickets;
        }

        return tickets.filter(ticket => ticket.status === statusFilter);
    };

    const filteredAssignedTickets = filterTickets(myAssignedTickets);
    const filteredCreatedTickets = filterTickets(myCreatedTickets);

    const handleFilterChange = (status: TicketStatus | 'ALL') => {
        setStatusFilter(status);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    const handleCreateTicket = () => {
        navigate('/create-ticket');
    };

    const getUserInitials = () => {
        if (!currentUser) return '';

        const firstInitial = currentUser.first_name ? currentUser.first_name.charAt(0).toUpperCase() : '';
        const lastInitial = currentUser.last_name ? currentUser.last_name.charAt(0).toUpperCase() : '';

        return firstInitial + lastInitial || currentUser.username.charAt(0).toUpperCase();
    };

    const isEmptyDashboard = !filteredAssignedTickets?.length && !filteredCreatedTickets?.length;

    const getTicketCountsByStatus = () => {
        const allTickets = [...(myCreatedTickets || []), ...(myAssignedTickets || [])];

        const uniqueTickets = [...new Map(allTickets.map(ticket => [ticket.id, ticket])).values()];

        return {
            total: uniqueTickets.length,
            opened: uniqueTickets.filter(ticket => ticket.status === TicketStatus.OPENED).length,
            inProgress: uniqueTickets.filter(ticket => ticket.status === TicketStatus.IN_PROGRESS).length,
            closed: uniqueTickets.filter(ticket => ticket.status === TicketStatus.CLOSED).length,
        };
    };

    const ticketCounts = getTicketCountsByStatus();

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

                        {/* Add Status Filter Component */}
                        <TicketFilter
                            onFilterChange={handleFilterChange}
                            currentFilter={statusFilter}
                        />

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
                                <div className="stat-card-number">{ticketCounts.total}</div>
                                <div className="stat-card-title">Total Tickets</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-open">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{ticketCounts.opened}</div>
                                <div className="stat-card-title">Opened</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-progress">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{ticketCounts.inProgress}</div>
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
                                <div className="stat-card-number">{ticketCounts.closed}</div>
                                <div className="stat-card-title">Closed</div>
                            </div>
                        </div>

                        {/* The horizontal row of tickets assigned to me */}
                        {filteredAssignedTickets.length > 0 && (
                            <TicketGrid
                                tickets={filteredAssignedTickets}
                                title={`Tickets Assigned to Me ${statusFilter !== 'ALL'
                                    ? `(${statusFilter})`
                                    : ''}`}
                                emptyMessage={`You don't have any ${statusFilter !== 'ALL'
                                    ? statusFilter.toLowerCase() + ' '
                                    : ''}tickets assigned to you`}
                                maxItems={5}
                            />
                        )}

                        {isEmptyDashboard ? (
                            <div className="empty-dashboard">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3>No {statusFilter !== 'ALL' ? `${formatTicketStatus(statusFilter as TicketStatus)} ` : ''}tickets found</h3>
                                <p>
                                    {statusFilter !== 'ALL'
                                        ? `You don't have any ${formatTicketStatus(statusFilter as TicketStatus).toLowerCase()} tickets. Try changing the filter or create a new ticket.`
                                        : `You don't have any tickets assigned to you or created by you. Get started by creating your first support ticket.`
                                    }
                                </p>
                                <button onClick={handleCreateTicket} className="button">Create Your First Ticket</button>
                            </div>
                        ) : (
                            <div className="ticket-sections-container">
                                {/* Traditional grid layout for created tickets */}
                                <TicketGrid
                                    tickets={filteredCreatedTickets}
                                    title={`Tickets Created by Me ${statusFilter !== 'ALL'
                                        ? `(${statusFilter})`
                                        : ''}`}
                                    emptyMessage={`You haven't created any ${statusFilter !== 'ALL'
                                        ? statusFilter.toLowerCase() + ' '
                                        : ''}tickets yet`}
                                    maxItems={12}
                                />
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;