import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTicketById,
    addComment,
    updateComment,
    deleteComment,
    assignTicketToMe
} from '../../store/slices/ticketSlice';
import {
    assignTicketToUser,
    updateTicketStatus,
    unassignTicket,
    fetchUsers
} from '../../store/slices/supportSlice';
import { AppDispatch, RootState } from '../../store';
import { TicketStatus, UserIdRequestDto } from '../../types';
import { hasAnyRole } from '../../utils/jwtUtils';
import { UserRole } from '../../types';
import { formatDateTime } from '../../utils/dateUtils';

import Container from '../../components/layout/Container/Container';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import CommentSection from '../../components/modules/comments/CommentSection/CommentSection';
import Modal from '../../components/ui/Modal/Modal';
import Avatar from '../../components/ui/Avatar/Avatar';
import Alert from '../../components/ui/Alert/Alert';
import Spinner from '../../components/ui/Spinner/Spinner';
import ConfirmationDialog from '../../components/common/ConfirmationDialog/ConfirmationDialog';

import './TicketDetailPage.css';

const TicketDetailPage: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
    const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
    const [showAssignToMeConfirmation, setShowAssignToMeConfirmation] = useState(false);
    const [operationError, setOperationError] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<TicketStatus | null>(null);
    const [isAssignedToMe, setIsAssignedToMe] = useState(false);
    const [assigningToMe, setAssigningToMe] = useState(false);

    const { currentTicket, loading, error } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { currentUser } = useSelector((state: RootState) => state.user);
    const { users, loading: supportLoading, loadingUsers } = useSelector((state: RootState) => state.support);

    const hasSupportRole = hasAnyRole([UserRole.SUPPORT, UserRole.ADMIN]);
    const isTicketCreator = currentUser?.id === currentTicket?.reporter?.id;
    const isTicketClosed = currentTicket?.status === TicketStatus.CLOSED;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        if (ticketId) {
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

    useEffect(() => {
        if (showUserSelectionModal && hasSupportRole) {
            dispatch(fetchUsers());
        }
    }, [dispatch, showUserSelectionModal, hasSupportRole]);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleBackToSupportPage = () => {
        navigate('/support/tickets');
    };

    const handleAssignToMeClick = () => {
        if (!currentUser || !ticketId) return;

        if (currentTicket?.assignee && currentTicket.assignee.id !== currentUser.id) {
            setShowAssignToMeConfirmation(true);
        } else {
            executeAssignToMe();
        }
    };

    const executeAssignToMe = async () => {
        if (!ticketId) return;

        try {
            setOperationError(null);
            setAssigningToMe(true);

            await dispatch(assignTicketToMe(ticketId)).unwrap();
            await dispatch(fetchTicketById(ticketId)).unwrap();
            setShowAssignToMeConfirmation(false);
        } catch (error: any) {
            console.error('Failed to assign ticket to me:', error);
            setOperationError(
                error?.message || 'Failed to assign ticket to yourself. Please try again.'
            );
        } finally {
            setAssigningToMe(false);
        }
    };

    const handleAssignToUser = async (userId: string) => {
        if (!ticketId) return;

        try {
            setOperationError(null);
            const userIdRequest: UserIdRequestDto = { user_id: userId };
            await dispatch(assignTicketToUser({ ticketId, userId: userIdRequest })).unwrap();
            await dispatch(fetchTicketById(ticketId)).unwrap();
            setShowUserSelectionModal(false);
        } catch (error: any) {
            console.error('Failed to assign ticket:', error);
            setOperationError(
                error?.message || 'Failed to assign ticket. Please try again.'
            );
        }
    };

    const handleUnassignTicket = async () => {
        if (!ticketId) return;

        try {
            setOperationError(null);
            await dispatch(unassignTicket(ticketId)).unwrap();
            await dispatch(fetchTicketById(ticketId)).unwrap();
        } catch (error: any) {
            console.error('Failed to unassign ticket:', error);
            setOperationError(
                error?.message || 'Failed to unassign ticket. Please try again.'
            );
        }
    };

    const handleStatusChange = async () => {
        if (!ticketId || !selectedStatus) return;

        try {
            setOperationError(null);
            await dispatch(updateTicketStatus({
                ticketId,
                status: { status: selectedStatus }
            })).unwrap();
            await dispatch(fetchTicketById(ticketId)).unwrap();
            setShowStatusChangeModal(false);
            setSelectedStatus(null);
        } catch (error: any) {
            setOperationError(
                error?.message || 'Failed to update ticket status. Please try again.'
            );
        }
    };

    const handleAddComment = async (ticketId: string, text: string): Promise<void> => {
        if (!ticketId) return;

        try {
            await dispatch(addComment({
                ticketId,
                commentData: { text }
            })).unwrap();
            await dispatch(fetchTicketById(ticketId)).unwrap();
        } catch (error: any) {
            throw new Error(error?.message || 'Failed to add comment');
        }
    };

    const handleUpdateComment = async (commentId: string, text: string): Promise<void> => {
        try {
            await dispatch(updateComment({
                commentId,
                commentData: { text }
            })).unwrap();

            if (ticketId) {
                await dispatch(fetchTicketById(ticketId)).unwrap();
            }
        } catch (error: any) {
            throw new Error(error?.message || 'Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: string): Promise<void> => {
        if (!ticketId) return;

        try {
            await dispatch(deleteComment({
                commentId,
                ticketId
            })).unwrap();
            await dispatch(fetchTicketById(ticketId)).unwrap();
        } catch (error: any) {
            throw new Error(error?.message || 'Failed to delete comment');
        }
    };

    const getDisplayName = (user: any) => {
        if (!user) return 'Unknown';
        return user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : user.username;
    };

    if (loading) {
        return (
            <Container>
                <div className="ticket-detail-loading">
                    <Spinner size="lg" />
                    <p>Loading ticket details...</p>
                </div>
            </Container>
        );
    }

    if (error || !currentTicket) {
        return (
            <Container>
                <Alert
                    variant="danger"
                    title="Error"
                    className="mb-4"
                >
                    {error || "Ticket not found"}
                </Alert>
                <Button
                    variant="outline"
                    onClick={handleBackToDashboard}
                >
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

    const headerActions = (
        <>
            {hasSupportRole && (
                <>
                    <Button
                        variant="primary"
                        onClick={() => setShowStatusChangeModal(true)}
                    >
                        Change Status
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => setShowUserSelectionModal(true)}
                    >
                        Assign Ticket
                    </Button>

                    {currentTicket.assignee && (
                        <Button
                            variant="outline"
                            onClick={handleUnassignTicket}
                            disabled={supportLoading}
                        >
                            Unassign
                        </Button>
                    )}
                </>
            )}

            {/* Support for ticket creators to assign tickets */}
            {isTicketCreator && !hasSupportRole && !isTicketClosed && !isAssignedToMe && (
                <Button
                    variant="primary"
                    onClick={handleAssignToMeClick}
                    disabled={supportLoading || assigningToMe}
                    isLoading={assigningToMe}
                >
                    {assigningToMe ? 'Assigning...' : 'Assign to Me'}
                </Button>
            )}

            {hasSupportRole && (
                <Button
                    variant="outline"
                    onClick={handleBackToSupportPage}
                >
                    Back to Support
                </Button>
            )}
            <Button
                variant="outline"
                onClick={handleBackToDashboard}
            >
                Back to Dashboard
            </Button>
        </>
    );

    return (
        <Container>
            <PageHeader
                title="Ticket Details"
                actions={headerActions}
            />

            {operationError && (
                <Alert
                    variant="danger"
                    title="Error"
                    className="mb-4"
                    dismissible
                    onDismiss={() => setOperationError(null)}
                >
                    {operationError}
                </Alert>
            )}

            {isAssignedToMe && (
                <Alert
                    variant="success"
                    className="mb-4"
                >
                    This ticket is assigned to you
                </Alert>
            )}

            <div className="ticket-detail-layout">
                <div className="ticket-detail-main">
                    <Card className="ticket-card">
                        <div className="ticket-header">
                            <h2 className="ticket-title">{currentTicket.title}</h2>
                            <div className="ticket-meta">
                                <StatusBadge status={currentTicket.status} size="md" />
                            </div>
                        </div>

                        <div className="ticket-description">
                            {currentTicket.description}
                        </div>

                        <div className="ticket-footer">
                            <div className="ticket-reporter">
                                <span className="ticket-label">Reported by:</span>
                                <div className="ticket-user">
                                    <Avatar
                                        name={getDisplayName(currentTicket.reporter)}
                                        size="sm"
                                    />
                                    <span>{getDisplayName(currentTicket.reporter)}</span>
                                </div>
                            </div>

                            <div className="ticket-date">
                                <span className="ticket-label">Created:</span>
                                <span>{formatDateTime(currentTicket.created_at)}</span>
                            </div>
                        </div>
                    </Card>

                    <CommentSection
                        ticketId={currentTicket.id}
                        comments={currentTicket.comments || []}
                        currentUser={currentUser}
                        isLoading={loading || supportLoading}
                        error={error}
                        onAddComment={handleAddComment}
                        onUpdateComment={handleUpdateComment}
                        onDeleteComment={handleDeleteComment}
                    />
                </div>

                <div className="ticket-detail-sidebar">
                    <Card className="ticket-info-card">
                        <h3 className="ticket-info-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Ticket Information
                        </h3>

                        <div className="ticket-info-list">
                            <div className="ticket-info-item">
                                <span className="ticket-info-label">Status</span>
                                <StatusBadge status={currentTicket.status} />
                            </div>

                            <div className="ticket-info-item">
                                <span className="ticket-info-label">Created</span>
                                <span className="ticket-info-value">{formatDateTime(currentTicket.created_at)}</span>
                            </div>

                            <div className="ticket-info-item">
                                <span className="ticket-info-label">Last Updated</span>
                                <span className="ticket-info-value">{formatDateTime(currentTicket.updated_at)}</span>
                            </div>

                            {(
                                <div className="ticket-info-item">
                                    <span className="ticket-info-label">Status</span>
                                    <span className="ticket-info-value archived-status">Archived</span>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="ticket-assignee-card">
                        <h3 className="ticket-info-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Assigned To
                        </h3>

                        {currentTicket.assignee ? (
                            <div className="ticket-assignee">
                                <div className="ticket-assignee-user">
                                    <Avatar
                                        name={getDisplayName(currentTicket.assignee)}
                                        size="md"
                                    />
                                    <div className="ticket-assignee-info">
                                        <div className="ticket-assignee-name">
                                            {getDisplayName(currentTicket.assignee)}
                                        </div>
                                        <div className="ticket-assignee-email">
                                            {currentTicket.assignee.email}
                                        </div>
                                        {isAssignedToMe && (
                                            <div className="ticket-assigned-to-me">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12" height="12">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                This is you
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="ticket-unassigned">
                                <div className="ticket-unassigned-message">
                                    Not assigned to anyone
                                </div>
                                {!isTicketClosed && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={hasSupportRole ? () => setShowUserSelectionModal(true) : handleAssignToMeClick}
                                        disabled={assigningToMe}
                                        isLoading={assigningToMe}
                                    >
                                        {hasSupportRole ? 'Assign User' : 'Assign to Me'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card>

                    {currentTicket.logs && currentTicket.logs.length > 0 && (
                        <Card className="ticket-activity-card">
                            <h3 className="ticket-info-title">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Activity Log
                            </h3>

                            <div className="ticket-activity-list">
                                {currentTicket.logs.map((log, index) => (
                                    <div key={index} className="ticket-activity-item">
                                        <div className="ticket-activity-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ticket-activity-content">
                                            <div className="ticket-activity-user">
                                                {log.action_by?.username || 'System'}
                                            </div>
                                            <div className="ticket-activity-action">
                                                {log.action}
                                            </div>
                                            <div className="ticket-activity-date">
                                                {formatDateTime(log.action_date)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* User Selection Modal */}
            {showUserSelectionModal && (
                <Modal
                    isOpen={showUserSelectionModal}
                    title="Assign Ticket to User"
                    onClose={() => setShowUserSelectionModal(false)}
                    size="md"
                >
                    <div className="user-selection-modal">
                        {loadingUsers ? (
                            <div className="user-selection-loading">
                                <Spinner size="md" />
                                <p>Loading users...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="user-selection-empty">
                                <p>No users available. Please refresh or try again.</p>
                                <Button
                                    variant="primary"
                                    onClick={() => dispatch(fetchUsers())}
                                    className="mt-4"
                                >
                                    Refresh Users
                                </Button>
                            </div>
                        ) : (
                            <div className="user-selection-list">
                                {users.map(user => (
                                    <div
                                        key={user.id}
                                        className={`user-selection-item ${user.id === currentTicket.assignee?.id ? 'user-selection-item-current' : ''}`}
                                        onClick={() => handleAssignToUser(user.id)}
                                    >
                                        <Avatar
                                            name={getDisplayName(user)}
                                            size="md"
                                        />
                                        <div className="user-selection-info">
                                            <div className="user-selection-name">
                                                {getDisplayName(user)}
                                            </div>
                                            <div className="user-selection-email">
                                                {user.email}
                                            </div>
                                        </div>
                                        {user.id === currentTicket.assignee?.id && (
                                            <div className="user-selection-current">Current</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Status Change Modal */}
            {showStatusChangeModal && (
                <Modal
                    isOpen={showStatusChangeModal}
                    title="Change Ticket Status"
                    onClose={() => {
                        setShowStatusChangeModal(false);
                        setSelectedStatus(null);
                    }}
                    size="sm"
                    footer={
                        <>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowStatusChangeModal(false);
                                    setSelectedStatus(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleStatusChange}
                                disabled={!selectedStatus || selectedStatus === currentTicket.status}
                            >
                                Update Status
                            </Button>
                        </>
                    }
                >
                    <div className="status-change-modal">
                        <p className="status-change-info">
                            Current Status: <StatusBadge status={currentTicket.status} />
                        </p>

                        <div className="status-options">
                            {Object.values(TicketStatus).map(status => (
                                <div
                                    key={status}
                                    className={`status-option ${status === currentTicket.status ? 'status-option-current' : ''} ${status === selectedStatus ? 'status-option-selected' : ''}`}
                                    onClick={() => status !== currentTicket.status ? setSelectedStatus(status) : null}
                                >
                                    <div className={`status-option-indicator status-${status.toLowerCase()}`}></div>
                                    <div className="status-option-label">{status.replace('_', ' ')}</div>
                                    {status === currentTicket.status && (
                                        <div className="status-option-marker">Current</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}

            {/* Assign to Me Confirmation */}
            <ConfirmationDialog
                isOpen={showAssignToMeConfirmation}
                title="Reassign Ticket"
                onConfirm={executeAssignToMe}
                onCancel={() => setShowAssignToMeConfirmation(false)}
                confirmButtonText="Yes, Assign to Me"
                cancelButtonText="Cancel"
                isConfirming={assigningToMe}
            >
                <p>
                    This ticket is currently assigned to <strong>{getDisplayName(currentTicket.assignee)}</strong>.
                </p>
                <p>Are you sure you want to reassign this ticket to yourself?</p>
            </ConfirmationDialog>
        </Container>
    );
};

export default TicketDetailPage;