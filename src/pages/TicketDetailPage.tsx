import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTicketById, assignTicketToMe } from '../redux/slices/ticketSlice';
import { AppDispatch, RootState } from '../redux/store';
import { TicketStatus } from '../types/ticket-service/status/TicketStatus';

const TicketDetailPage = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentTicket, loading, error } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        if (ticketId) {
            dispatch(fetchTicketById(ticketId));
        }
    }, [dispatch, ticketId, isAuthenticated, navigate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.OPENED:
                return '#28a745';
            case TicketStatus.IN_PROGRESS:
                return '#ffc107';
            case TicketStatus.CLOSED:
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleAssignToMe = () => {
        if (ticketId) {
            dispatch(assignTicketToMe(ticketId))
                .then(() => {
                    dispatch(fetchTicketById(ticketId));
                });
        }
    };

    const styles = {
        container: {
            maxWidth: '800px',
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
        buttonGroup: {
            display: 'flex',
            gap: '10px',
        },
        button: {
            padding: '10px 15px',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
        },
        assignButton: {
            padding: '10px 15px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
        },
        ticketContainer: {
            backgroundColor: '#f9f9f9',
            borderRadius: '5px',
            padding: '20px',
            marginBottom: '20px',
        },
        ticketTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
            paddingRight: '80px',
            position: 'relative' as const,
        },
        ticketStatus: {
            position: 'absolute' as const,
            top: '0',
            right: '0',
            padding: '5px 10px',
            borderRadius: '4px',
            color: 'white',
            fontWeight: 'bold',
        },
        ticketDescription: {
            fontSize: '16px',
            marginBottom: '20px',
            whiteSpace: 'pre-wrap' as const,
        },
        ticketMeta: {
            display: 'grid',
            gridTemplateColumns: '150px 1fr',
            gap: '10px',
            marginBottom: '5px',
        },
        label: {
            fontWeight: 'bold',
            color: '#555',
        },
        value: {
            color: '#333',
        },
        metaSection: {
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
        },
        commentsSection: {
            marginTop: '30px',
        },
        commentCard: {
            backgroundColor: '#f0f0f0',
            borderRadius: '5px',
            padding: '15px',
            marginBottom: '10px',
        },
        commentHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
        },
        commentAuthor: {
            fontWeight: 'bold',
        },
        commentDate: {
            fontSize: '12px',
            color: '#666',
        },
        commentText: {
            fontSize: '14px',
        },
        noComments: {
            fontStyle: 'italic',
            color: '#666',
            textAlign: 'center' as const,
            margin: '20px 0',
        },
        logsSection: {
            marginTop: '30px',
        },
        logItem: {
            padding: '8px 0',
            borderBottom: '1px solid #eee',
            fontSize: '14px',
        },
        error: {
            color: 'red',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            marginBottom: '20px',
        },
        loading: {
            textAlign: 'center' as const,
            margin: '40px 0',
            color: '#666',
        },
    };

    if (loading) {
        return <div style={styles.container}><div style={styles.loading}>Loading ticket details...</div></div>;
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>{error}</div>
                <button style={styles.button} onClick={handleBackToDashboard}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!currentTicket) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>Ticket not found</div>
                <button style={styles.button} onClick={handleBackToDashboard}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Ticket Details</h1>
                <div style={styles.buttonGroup}>
                    {/* Only show Assign button if the current user is not already the assignee */}
                    {(!currentTicket.assignee || currentTicket.assignee.id !== user?.id) && (
                        <button style={styles.assignButton} onClick={handleAssignToMe}>
                            Assign to Me
                        </button>
                    )}
                    <button style={styles.button} onClick={handleBackToDashboard}>
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <div style={styles.ticketContainer}>
                <div style={styles.ticketTitle}>
                    {currentTicket.title}
                    <span
                        style={{
                            ...styles.ticketStatus,
                            backgroundColor: getStatusColor(currentTicket.status),
                        }}
                    >
                        {currentTicket.status}
                    </span>
                </div>

                <div style={styles.ticketDescription}>{currentTicket.description}</div>

                <div style={styles.metaSection}>
                    <h3>Ticket Information</h3>
                    <div style={styles.ticketMeta}>
                        <span style={styles.label}>Created:</span>
                        <span style={styles.value}>{formatDate(currentTicket.created_at)}</span>

                        <span style={styles.label}>Last Updated:</span>
                        <span style={styles.value}>{formatDate(currentTicket.updated_at)}</span>

                        <span style={styles.label}>Reporter:</span>
                        <span style={styles.value}>
                            {currentTicket.reporter?.username || 'Unknown'}
                            ({currentTicket.reporter?.email || 'No email'})
                        </span>

                        <span style={styles.label}>Assignee:</span>
                        <span style={styles.value}>
                            {currentTicket.assignee
                                ? `${currentTicket.assignee.username} (${currentTicket.assignee.email})`
                                : 'Unassigned'}
                        </span>
                    </div>
                </div>

                <div style={styles.commentsSection}>
                    <h3>Comments</h3>
                    {currentTicket.comments && currentTicket.comments.length > 0 ? (
                        currentTicket.comments.map((comment, index) => (
                            <div key={index} style={styles.commentCard}>
                                <div style={styles.commentHeader}>
                                    <div style={styles.commentAuthor}>{comment.author?.username || 'Unknown User'}</div>
                                    <div style={styles.commentDate}>{formatDate(comment.created_date)}</div>
                                </div>
                                <div style={styles.commentText}>{comment.text}</div>
                            </div>
                        ))
                    ) : (
                        <div style={styles.noComments}>No comments yet</div>
                    )}
                </div>

                <div style={styles.logsSection}>
                    <h3>Activity Log</h3>
                    {currentTicket.logs && currentTicket.logs.length > 0 ? (
                        currentTicket.logs.map((log, index) => (
                            <div key={index} style={styles.logItem}>
                                <strong>{log.action_by?.username || 'System'}</strong> {log.action} on{' '}
                                {formatDate(log.action_date)}
                            </div>
                        ))
                    ) : (
                        <div style={styles.noComments}>No activity recorded</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;