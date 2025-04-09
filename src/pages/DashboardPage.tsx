import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { fetchCurrentUser } from '../redux/slices/userSlice';
import { fetchTickets } from '../redux/slices/ticketSlice';
import { AppDispatch, RootState } from '../redux/store';
import { TicketStatus } from '../types/ticket-service/status/TicketStatus';

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

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        header: {
            marginBottom: '20px',
            color: '#333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        content: {
            marginBottom: '30px',
        },
        userProfile: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '10px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '5px',
            marginBottom: '20px',
        },
        userInfo: {
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            gap: '5px',
        },
        label: {
            fontWeight: 'bold',
            color: '#555',
        },
        value: {
            color: '#333',
        },
        button: {
            padding: '10px 15px',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '10px',
        },
        actionsContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        createTicketButton: {
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'block',
            margin: '20px 0',
        },
        ticketsSection: {
            marginTop: '30px',
        },
        ticketsHeader: {
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        ticketsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
            marginTop: '20px',
        },
        ticketCard: {
            backgroundColor: '#f9f9f9',
            borderRadius: '5px',
            padding: '15px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column' as const,
            height: '200px',
            position: 'relative' as const,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            overflow: 'hidden' as const,
        },
        ticketCardHover: {
            transform: 'translateY(-5px)',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        },
        ticketTitle: {
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '10px',
            overflow: 'hidden' as const,
            textOverflow: 'ellipsis' as const,
            display: '-webkit-box' as any,
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as any,
        },
        ticketDescription: {
            fontSize: '14px',
            color: '#666',
            flex: 1,
            overflow: 'hidden' as const,
            textOverflow: 'ellipsis' as const,
            display: '-webkit-box' as any,
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as any,
        },
        ticketFooter: {
            borderTop: '1px solid #eee',
            marginTop: '10px',
            paddingTop: '10px',
            fontSize: '12px',
            color: '#888',
        },
        ticketStatus: {
            position: 'absolute' as const,
            top: '10px',
            right: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '3px 6px',
            borderRadius: '3px',
            color: 'white',
        },
        noTickets: {
            textAlign: 'center' as const,
            color: '#666',
            margin: '40px 0',
            fontStyle: 'italic',
        },
        loading: {
            textAlign: 'center' as const,
            color: '#666',
            margin: '20px 0',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Dashboard</h1>
                <div style={styles.actionsContainer}>
                    <button style={styles.button} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                <h2>Welcome to the Support Application</h2>
                <p>Here you can view your account details and manage your support tickets.</p>

                {userLoading ? (
                    <p>Loading user information...</p>
                ) : currentUser ? (
                    <div style={styles.userProfile}>
                        <h3>User Profile</h3>
                        <div style={styles.userInfo}>
                            <span style={styles.label}>Username:</span>
                            <span style={styles.value}>{currentUser.username}</span>

                            <span style={styles.label}>Email:</span>
                            <span style={styles.value}>{currentUser.email}</span>

                            <span style={styles.label}>First Name:</span>
                            <span style={styles.value}>{currentUser.first_name || 'Not provided'}</span>

                            <span style={styles.label}>Last Name:</span>
                            <span style={styles.value}>{currentUser.last_name || 'Not provided'}</span>

                            <span style={styles.label}>User ID:</span>
                            <span style={styles.value}>{currentUser.id}</span>
                        </div>
                    </div>
                ) : (
                    <p>No user information available. Please log in again.</p>
                )}

                {currentUser && (
                    <button
                        style={styles.createTicketButton}
                        onClick={handleCreateTicket}
                    >
                        Create New Support Ticket
                    </button>
                )}
            </div>

            {/* Tickets Section */}
            <div style={styles.ticketsSection}>
                <div style={styles.ticketsHeader}>
                    <h2>Your Support Tickets</h2>
                </div>

                {ticketsLoading ? (
                    <div style={styles.loading}>Loading your tickets...</div>
                ) : tickets && tickets.length > 0 ? (
                    <div style={styles.ticketsGrid}>
                        {tickets.map(ticket => (
                            <div
                                key={ticket.id}
                                style={styles.ticketCard}
                                onClick={() => handleViewTicket(ticket.id)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div style={{
                                    ...styles.ticketStatus,
                                    backgroundColor: getStatusColor(ticket.status)
                                }}>
                                    {ticket.status}
                                </div>
                                <div style={styles.ticketTitle}>{ticket.title}</div>
                                <div style={styles.ticketDescription}>{ticket.description}</div>
                                <div style={styles.ticketFooter}>
                                    Created: {formatDate(ticket.created_at)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.noTickets}>
                        You haven't created any tickets yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;