import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTicketById, assignTicketToMe } from '../../store/slices/ticketSlice';
import { fetchCurrentUser } from '../../store/slices/userSlice';
import { AppDispatch, RootState } from '../../store';
import { formatTicketStatus, getStatusClassName } from '../../utils/formatters';
import { formatDateTime, formatRelativeTime } from '../../utils/dateUtils';
import ConfirmationDialog from '../../components/common/ConfirmationDialog/ConfirmationDialog';
import './TicketDetailPage.css';
import StatusBadge from "../../components/common/StatusBadge/StatusBadge.tsx";
import {TicketStatus} from "../../types";

const TicketDetailPage = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { currentTicket, loading, error } = useSelector((state: RootState) => state.tickets);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.user);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isAssignedToMe, setIsAssignedToMe] = useState(false);
    const [assignmentError, setAssignmentError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        if (ticketId) {
            dispatch(fetchCurrentUser());
            dispatch(fetchTicketById(ticketId));
        }
    }, [dispatch, ticketId, isAuthenticated, navigate]);

    useEffect(() => {
        if (currentTicket && currentUser) {
            const assigned = Boolean(
                currentUser.id &&
                currentTicket.assignee?.id &&
                currentTicket.assignee.id === currentUser.id
            );
            setIsAssignedToMe(assigned);
        }
    }, [currentTicket, currentUser]);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleAssignToMeClick = async () => {
        if (currentTicket?.assignee && currentUser && currentTicket.assignee.id !== currentUser.id) {
            setShowConfirmDialog(true);
        } else if (!currentTicket?.assignee) {
            try {
                await handleAssignToMe();
            } catch (error) {
                console.error('Assignment failed in click handler:', error);
            }
        }
    };

    const handleAssignToMe = async () => {
        if (ticketId && !isAssignedToMe) {
            try {
                setAssignmentError(null);
                await dispatch(assignTicketToMe(ticketId)).unwrap();
                await dispatch(fetchTicketById(ticketId)).unwrap();
                setShowConfirmDialog(false);
            } catch (error: any) {
                console.error('Failed to assign ticket:', error);
                setAssignmentError(
                    error?.message || 'Failed to assign ticket. Please try again.'
                );
            }
        }
    };

    const handleCancelAssign = () => {
        setShowConfirmDialog(false);
        setAssignmentError(null);
    };

    const isTicketClosed = currentTicket?.status === TicketStatus.CLOSED;

    if (loading || userLoading) {
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
                    {!isTicketClosed && !isAssignedToMe && (
                        <button
                            className="assign-button"
                            onClick={handleAssignToMeClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Assign to Me
                        </button>
                    )}
                    {isAssignedToMe && (
                        <div className="assigned-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Assigned to You
                        </div>
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
                        <div className={`ticket-status-badge ${getStatusClassName(currentTicket.status)}`}>
                            {formatTicketStatus(currentTicket.status)}
                        </div>
                    </div>

                    <div className="ticket-body">
                        <div className="ticket-description">
                            {currentTicket.description}
                        </div>
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
                                <div className="info-value">{formatDateTime(currentTicket.created_at)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Last Updated</div>
                                <div className="info-value">{formatDateTime(currentTicket.updated_at)}</div>
                            </div>
                            <div className="info-item">
                                <div className="info-label">Status</div>
                                <div className="info-value">
                                    <StatusBadge status={currentTicket.status} />
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
                                            {isAssignedToMe && (
                                                <div className="assign-indicator">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    This is you
                                                </div>
                                            )}
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

            {/* Confirmation Dialog for reassigning ticket */}
            <ConfirmationDialog
                isOpen={showConfirmDialog}
                title="Reassign Ticket"
                onConfirm={handleAssignToMe}
                onCancel={handleCancelAssign}
                confirmButtonText="Yes, Assign to Me"
                cancelButtonText="Cancel"
            >
                <p>
                    This ticket is currently assigned to <strong>{currentTicket?.assignee?.username}</strong>.
                    Are you sure you want to assign it to yourself?
                </p>
                {assignmentError && (
                    <div className="error-message" style={{ marginTop: '10px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {assignmentError}
                    </div>
                )}
            </ConfirmationDialog>
        </div>
    );
};

export default TicketDetailPage;