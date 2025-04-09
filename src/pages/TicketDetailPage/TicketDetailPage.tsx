import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTicketById, assignTicketToMe } from '../../redux/slices/ticketSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { TicketStatus } from '../../types/ticket-service/status/TicketStatus';
import './TicketDetailPage.css';

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

    if (loading) {
        return <div className="ticket-detail-container"><div className="loading">Loading ticket details...</div></div>;
    }

    if (error) {
        return (
            <div className="ticket-detail-container">
                <div className="error">{error}</div>
                <button className="button" onClick={handleBackToDashboard}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!currentTicket) {
        return (
            <div className="ticket-detail-container">
                <div className="error">Ticket not found</div>
                <button className="button" onClick={handleBackToDashboard}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="ticket-detail-container">
            <div className="header">
                <h1>Ticket Details</h1>
                <div className="button-group">
                    {/* Only show Assign button if the current user is not already the assignee */}
                    {(!currentTicket.assignee || currentTicket.assignee.id !== user?.id) && (
                        <button className="assign-button" onClick={handleAssignToMe}>
                            Assign to Me
                        </button>
                    )}
                    <button className="button" onClick={handleBackToDashboard}>
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="ticket-container">
                <div className="ticket-title">
                    {currentTicket.title}
                    <span
                        className="ticket-status"
                        style={{
                            backgroundColor: getStatusColor(currentTicket.status),
                        }}
                    >
                        {currentTicket.status}
                    </span>
                </div>

                <div className="ticket-description">{currentTicket.description}</div>

                <div className="meta-section">
                    <h3>Ticket Information</h3>
                    <div className="ticket-meta">
                        <span className="label">Created:</span>
                        <span className="value">{formatDate(currentTicket.created_at)}</span>

                        <span className="label">Last Updated:</span>
                        <span className="value">{formatDate(currentTicket.updated_at)}</span>

                        <span className="label">Reporter:</span>
                        <span className="value">
                            {currentTicket.reporter?.username || 'Unknown'}
                            ({currentTicket.reporter?.email || 'No email'})
                        </span>

                        <span className="label">Assignee:</span>
                        <span className="value">
                            {currentTicket.assignee
                                ? `${currentTicket.assignee.username} (${currentTicket.assignee.email})`
                                : 'Unassigned'}
                        </span>
                    </div>
                </div>

                <div className="comments-section">
                    <h3>Comments</h3>
                    {currentTicket.comments && currentTicket.comments.length > 0 ? (
                        currentTicket.comments.map((comment, index) => (
                            <div key={index} className="comment-card">
                                <div className="comment-header">
                                    <div className="comment-author">{comment.author?.username || 'Unknown User'}</div>
                                    <div className="comment-date">{formatDate(comment.created_date)}</div>
                                </div>
                                <div className="comment-text">{comment.text}</div>
                            </div>
                        ))
                    ) : (
                        <div className="no-comments">No comments yet</div>
                    )}
                </div>

                <div className="logs-section">
                    <h3>Activity Log</h3>
                    {currentTicket.logs && currentTicket.logs.length > 0 ? (
                        currentTicket.logs.map((log, index) => (
                            <div key={index} className="log-item">
                                <strong>{log.action_by?.username || 'System'}</strong> {log.action} on{' '}
                                {formatDate(log.action_date)}
                            </div>
                        ))
                    ) : (
                        <div className="no-comments">No activity recorded</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;