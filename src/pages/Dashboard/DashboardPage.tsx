import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { fetchCurrentUser } from '../../redux/slices/userSlice';
import { fetchMyAssignedTickets, fetchMyCreatedTickets } from '../../redux/slices/ticketSlice';
import { AppDispatch, RootState } from '../../redux/store';
import TicketGrid from '../../components/TicketGrid/TicketGrid';
import './DashboardPage.css';

const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Get user data from Redux store
    const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.user);
    const {
        myAssignedTickets,
        myCreatedTickets,
        loading: ticketsLoading
    } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // On component mount, fetch user and ticket data if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCurrentUser());
            dispatch(fetchMyAssignedTickets({ size: 6 }));
            dispatch(fetchMyCreatedTickets({ size: 6 }));
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

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!currentUser) return '';

        const firstInitial = currentUser.first_name ? currentUser.first_name.charAt(0).toUpperCase() : '';
        const lastInitial = currentUser.last_name ? currentUser.last_name.charAt(0).toUpperCase() : '';

        return firstInitial + lastInitial || currentUser.username.charAt(0).toUpperCase();
    };

    const isEmptyDashboard = !myAssignedTickets?.length && !myCreatedTickets?.length;

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
                                <div className="stat-card-number">{(myCreatedTickets?.length || 0) + (myAssignedTickets?.length || 0)}</div>
                                <div className="stat-card-title">Active Tickets</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-open">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{myAssignedTickets?.length || 0}</div>
                                <div className="stat-card-title">Assigned to Me</div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-card-header">
                                    <div className="stat-card-icon stat-icon-progress">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="stat-card-number">{myCreatedTickets?.length || 0}</div>
                                <div className="stat-card-title">Created by Me</div>
                            </div>
                        </div>

                        {isEmptyDashboard ? (
                            <div className="empty-dashboard">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3>No Active Tickets Found</h3>
                                <p>
                                    You don't have any active tickets assigned to you or created by you.
                                    Get started by creating your first support ticket.
                                </p>
                                <button onClick={handleCreateTicket} className="button">Create Your First Ticket</button>
                            </div>
                        ) : (
                            <div className="ticket-sections-container">
                                <TicketGrid
                                    tickets={myAssignedTickets || []}
                                    title="Tickets Assigned to Me"
                                    emptyMessage="You don't have any tickets assigned to you"
                                    maxItems={6}
                                />

                                <TicketGrid
                                    tickets={myCreatedTickets || []}
                                    title="Tickets Created by Me"
                                    emptyMessage="You haven't created any tickets yet"
                                    maxItems={6}
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