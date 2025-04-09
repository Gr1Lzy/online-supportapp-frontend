import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { fetchCurrentUser } from '../../redux/slices/userSlice';
import { fetchTickets } from '../../redux/slices/ticketSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { TicketStatus } from '../../types/ticket-service/status/TicketStatus';
import './DashboardPage.css';

const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.user);
    const { tickets, loading: ticketsLoading } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.OPENED:
                return '#28a745'; // Green
            case TicketStatus.IN_PROGRESS:
                return '#ffc107'; // Yellow
            case TicketStatus.CLOSED:
                return '#dc3545'; // Red
            default:
                return '#6c757d'; // Gray
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="actions-container">
                    <button className="button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                <h2>Welcome to the Support Application</h2>
                <p>Here you can view your account details and manage your support tickets.</p>

                {userLoading ? (
                    <p>Loading user information...</p>
                ) : currentUser ? (
                    <div className="user-profile">
                        <h3>User Profile</h3>
                        <div className="user-info">
                            <span className="label">Username:</span>
                            <span className="value">{currentUser.username}</span>

                            <span className="label">Email:</span>
                            <span className="value">{currentUser.email}</span>

                            <span className="label">First Name:</span>
                            <span className="value">{currentUser.first_name || 'Not provided'}</span>

                            <span className="label">Last Name:</span>
                            <span className="value">{currentUser.last_name || 'Not provided'}</span>

                            <span className="label">User ID:</span>
                            <span className="value">{currentUser.id}</span>
                        </div>
                    </div>
                ) : (
                    <p>No user information available. Please log in again.</p>
                )}

                {currentUser && (
                    <button
                        className="create-ticket-button"
                        onClick={handleCreateTicket}
                    >
                        Create New Support Ticket
                    </button>
                )}
            </div>

            {/* Tickets Section */}
            <div className="tickets-section">
                <div className="tickets-header">
                    <h2>Your Support Tickets</h2>
                </div>

                {ticketsLoading ? (
                    <div className="loading">Loading your tickets...</div>
                ) : tickets && tickets.length > 0 ? (
                    <div className="tickets-grid">
                        {tickets.map(ticket => (
                            <div
                                key={ticket.id}
                                className="ticket-card"
                                onClick={() => handleViewTicket(ticket.id)}
                            >
                                <div className="ticket-status" style={{
                                    backgroundColor: getStatusColor(ticket.status)
                                }}>
                                    {ticket.status}
                                </div>
                                <div className="ticket-title">{ticket.title}</div>
                                <div className="ticket-description">{ticket.description}</div>
                                <div className="ticket-footer">
                                    Created: {formatDate(ticket.created_at)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-tickets">
                        You haven't created any tickets yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;