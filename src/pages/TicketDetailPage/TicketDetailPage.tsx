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

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else {
            return formatDate(dateString);
        }
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
        return (
            <div className="ticket-detail-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ticket-detail-container">
                <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
                <button className="back-button" onClick={handleBackToDashboard}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!currentTicket) {
        return (
            <div className="ticket-detail-container">
                <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ticket not found
                </div>
                <button className="back-button" onClick={handleBackToDashboard}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="ticket-detail-container">
            <header className="detail-header">
                <h1 className="detail-title">Ticket Details</h1>
                <div className="button-group">
                    {(!currentTicket.assignee || currentTicket.assignee.id !== user?.id) && (
                        <button className="assign-button" onClick={handleAssignToMe}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Assign to Me
                        </button>
                    )}
                    <button className="back-button" onClick={handleBackToDashboard}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="detail-content">
                <div className="ticket-main">
                    <div className="ticket-header">
                        <div className="ticket-title-wrapper">
                            <h2 className="ticket-title">{currentTicket.title}</h2>
                            <div>
                                Reported by: <strong>{currentTicket.reporter?.username || 'Unknown'}</strong>
                            </div>
                        </div>
                        <div className={`ticket-status-badge ${getStatusClass(currentTicket.status)}`}>
                            {currentTicket.status}
                        </div>
                    </div>

                    <div className="ticket-body">
                        <div className="ticket-description">{currentTicket.description}</div>
                    </div>

                    <div className="comments-section">
                        <h3 className="comments-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Comments
                        </h3>
                        {currentTicket.comments && currentTicket.comments.length > 0 ? (
                            <div className="comment-list">
                                {currentTicket.comments.map((comment, index) => (
                                    <div key={index} className="comment-card">
                                        <div className="comment-header">
                                            <div className="comment-author">{comment.author?.username || 'Unknown User'}</div>
                                            <div className="comment-date">{formatRelativeTime(comment.created_date)}</div>
                                        </div>
                                        <div className="comment-body">{comment.text}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-items">No comments yet</div>
                        )}
                    </div>
                </div>

                <div className="ticket-sidebar">
                    <div className="info-card">
                        <h3 className="info-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ticket Information
                        </h3>
                        <div className="info-list">
                            <div className="info-item">
                                <div className="info-label">Created</div>
                                <div className="info-value">{formatDate(currentTicket.created_at)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Last Updated</div>
                                <div className="info-value">{formatDate(currentTicket.updated_at)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Status</div>
                                <div className="info-value">
                                    <span className={`badge ${getStatusClass(currentTicket.status)}`}>
                                        {currentTicket.status}
                                    </span>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">ID</div>
                                <div className="info-value">{currentTicket.id}</div>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3 className="info-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            People
                        </h3>
                        <div className="info-list">
                            <div className="info-item">
                                <div className="info-label">Reporter</div>
                                <div className="info-value">
                                    {currentTicket.reporter ? (
                                        <>
                                            <div>{currentTicket.reporter.username}</div>
                                            <div className="info-label">{currentTicket.reporter.email}</div>
                                        </>
                                    ) : (
                                        'Unknown'
                                    )}
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Assignee</div>
                                <div className="info-value">
                                    {currentTicket.assignee ? (
                                        <>
                                            <div>{currentTicket.assignee.username}</div>
                                            <div className="info-label">{currentTicket.assignee.email}</div>
                                        </>
                                    ) : (
                                        'Unassigned'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3 className="info-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Activity Log
                        </h3>
                        {currentTicket.logs && currentTicket.logs.length > 0 ? (
                            <div className="activity-log">
                                {currentTicket.logs.map((log, index) => (
                                    <div key={index} className="log-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="log-user">{log.action_by?.username || 'System'}</span>
                                        {log.action}
                                        <span className="log-date">{formatRelativeTime(log.action_date)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-items">No activity recorded</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;