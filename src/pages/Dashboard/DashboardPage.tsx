import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchMyAssignedTickets,
    fetchMyCreatedTickets,
    fetchMyAssignedArchivedTickets,
    fetchMyCreatedArchivedTickets,
    setStatusFilter
} from '../../store/slices/ticketSlice';
import { logout } from '../../store/slices/authSlice';
import { fetchCurrentUser } from '../../store/slices/userSlice';
import { AppDispatch, RootState } from '../../store';
import { TicketResponseDto, TicketStatus, UserRole } from '../../types';
import { hasAnyRole } from '../../utils/jwtUtils';

import Container from '../../components/layout/Container/Container';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import TicketGrid from "../../components/modules/tickets/TicketGrid/TicketGrid";
import Spinner from '../../components/ui/Spinner/Spinner';
import Alert from '../../components/ui/Alert/Alert';
import Tabs from '../../components/ui/Tabs/Tabs';
import Tab from '../../components/ui/Tabs/Tab';

import './DashboardPage.css';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilterState] = useState<TicketStatus | 'ALL'>('ALL');
    const [viewMode, setViewMode] = useState<'active' | 'archived'>('active');
    const [page, setPage] = useState(0);
    const [size] = useState(20);

    const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.user);
    const {
        myAssignedTickets,
        myCreatedTickets,
        myAssignedArchivedTickets,
        myCreatedArchivedTickets,
        loading: ticketsLoading,
        error
    } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const hasSupportRole = hasAnyRole([UserRole.SUPPORT, UserRole.ADMIN]);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCurrentUser());

            if (viewMode === 'active') {
                dispatch(fetchMyAssignedTickets({ page, size }));
                dispatch(fetchMyCreatedTickets({ page, size }));
            } else {
                dispatch(fetchMyAssignedArchivedTickets({ page, size }));
                dispatch(fetchMyCreatedArchivedTickets({ page, size }));
            }

            dispatch(setStatusFilter(statusFilter));
        } else {
            navigate('/');
        }
    }, [dispatch, isAuthenticated, navigate, statusFilter, viewMode, page, size]);

    const filterTickets = (tickets: TicketResponseDto[] = []): TicketResponseDto[] => {
        if (statusFilter === 'ALL') {
            return tickets;
        }
        return tickets.filter(ticket => ticket.status === statusFilter);
    };

    const filteredAssignedTickets = filterTickets(myAssignedTickets);
    const filteredCreatedTickets = filterTickets(myCreatedTickets);
    const filteredAssignedArchivedTickets = filterTickets(myAssignedArchivedTickets);
    const filteredCreatedArchivedTickets = filterTickets(myCreatedArchivedTickets);

    const handleFilterChange = (status: TicketStatus | 'ALL') => {
        setStatusFilterState(status);
    };

    const handleViewModeChange = (mode: 'active' | 'archived') => {
        setViewMode(mode);
        setPage(0);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
    };

    const handleCreateTicket = () => {
        navigate('/create-ticket');
    };

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const getTicketCountsByStatus = () => {
        if (viewMode === 'active') {
            const allTickets = [...(myCreatedTickets || []), ...(myAssignedTickets || [])];
            const uniqueTickets = [...new Map(allTickets.map(ticket => [ticket.id, ticket])).values()];

            return {
                total: uniqueTickets.length,
                opened: uniqueTickets.filter(ticket => ticket.status === TicketStatus.OPENED).length,
                inProgress: uniqueTickets.filter(ticket => ticket.status === TicketStatus.IN_PROGRESS).length,
                closed: uniqueTickets.filter(ticket => ticket.status === TicketStatus.CLOSED).length,
            };
        } else {
            const allArchivedTickets = [...(myCreatedArchivedTickets || []), ...(myAssignedArchivedTickets || [])];
            const uniqueArchivedTickets = [...new Map(allArchivedTickets.map(ticket => [ticket.id, ticket])).values()];

            return {
                total: uniqueArchivedTickets.length,
                opened: uniqueArchivedTickets.filter(ticket => ticket.status === TicketStatus.OPENED).length,
                inProgress: uniqueArchivedTickets.filter(ticket => ticket.status === TicketStatus.IN_PROGRESS).length,
                closed: uniqueArchivedTickets.filter(ticket => ticket.status === TicketStatus.CLOSED).length,
            };
        }
    };

    const ticketCounts = getTicketCountsByStatus();
    const isEmptyDashboard = viewMode === 'active'
        ? !filteredAssignedTickets.length && !filteredCreatedTickets.length
        : !filteredAssignedArchivedTickets.length && !filteredCreatedArchivedTickets.length;

    if (userLoading || ticketsLoading) {
        return (
            <Container>
                <div className="dashboard-loading">
                    <Spinner size="lg" />
                    <p>Loading dashboard...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeader
                title="Support Dashboard"
                subtitle={currentUser ? `Welcome back, ${currentUser.first_name || currentUser.username}` : ''}
                actions={
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                }
            />

            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            <div className="dashboard-tabs">
                <Tabs>
                    <Tab
                        id="active"
                        label="Active Tickets"
                        isActive={viewMode === 'active'}
                        onClick={() => handleViewModeChange('active')}
                    />
                    <Tab
                        id="archived"
                        label="Archived Tickets"
                        isActive={viewMode === 'archived'}
                        onClick={() => handleViewModeChange('archived')}
                    />
                </Tabs>
            </div>

            <div className="dashboard-layout">
                <div className="dashboard-sidebar">
                    {/* Filter card */}
                    <Card className="filter-card">
                        <h3 className="filter-title">Filter by Status</h3>
                        <div className="filter-buttons">
                            <Button
                                variant={statusFilter === 'ALL' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange('ALL')}
                                className="filter-button"
                            >
                                All Tickets
                            </Button>

                            <Button
                                variant={statusFilter === TicketStatus.OPENED ? 'success' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange(TicketStatus.OPENED)}
                                className="filter-button"
                            >
                                Opened
                            </Button>

                            <Button
                                variant={statusFilter === TicketStatus.IN_PROGRESS ? 'warning' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange(TicketStatus.IN_PROGRESS)}
                                className="filter-button"
                            >
                                In Progress
                            </Button>

                            <Button
                                variant={statusFilter === TicketStatus.CLOSED ? 'danger' : 'outline'}
                                size="sm"
                                onClick={() => handleFilterChange(TicketStatus.CLOSED)}
                                className="filter-button"
                            >
                                Closed
                            </Button>
                        </div>
                    </Card>

                    {/* Action buttons */}
                    <div className="dashboard-actions">
                        <Button
                            variant="primary"
                            onClick={handleCreateTicket}
                            fullWidth
                        >
                            Create New Ticket
                        </Button>

                        {hasSupportRole && (
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/support/tickets')}
                                fullWidth
                            >
                                See All Tickets
                            </Button>
                        )}
                    </div>
                </div>

                <div className="dashboard-content">
                    {/* Stats cards */}
                    <div className="stats-cards">
                        <Card className="stat-card">
                            <div className="stat-card-icon stat-icon-tickets">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div className="stat-card-number">{ticketCounts.total}</div>
                            <div className="stat-card-title">{viewMode === 'active' ? 'Active Tickets' : 'Archived Tickets'}</div>
                        </Card>

                        <Card className="stat-card">
                            <div className="stat-card-icon stat-icon-open">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div className="stat-card-number">{ticketCounts.opened}</div>
                            <div className="stat-card-title">Opened</div>
                        </Card>

                        <Card className="stat-card">
                            <div className="stat-card-icon stat-icon-progress">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="stat-card-number">{ticketCounts.inProgress}</div>
                            <div className="stat-card-title">In Progress</div>
                        </Card>

                        <Card className="stat-card">
                            <div className="stat-card-icon stat-icon-closed">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="stat-card-number">{ticketCounts.closed}</div>
                            <div className="stat-card-title">Closed</div>
                        </Card>
                    </div>

                    {isEmptyDashboard ? (
                        <Card className="empty-dashboard">
                            <h3>No {statusFilter !== 'ALL' ? `${statusFilter.toLowerCase()} ` : ''}tickets found</h3>
                            <p>
                                {statusFilter !== 'ALL'
                                    ? `You don't have any ${statusFilter.toLowerCase()} tickets. Try changing the filter or create a new ticket.`
                                    : viewMode === 'active'
                                        ? `You don't have any tickets assigned to you or created by you. Get started by creating your first support ticket.`
                                        : `You don't have any archived tickets. Tickets that are older than 2 weeks are automatically archived.`
                                }
                            </p>
                            {viewMode === 'active' && (
                                <Button onClick={handleCreateTicket}>Create Your First Ticket</Button>
                            )}
                        </Card>
                    ) : (
                        <div className="ticket-sections">
                            {viewMode === 'active' ? (
                                <>
                                    {/* Assigned tickets section */}
                                    {filteredAssignedTickets.length > 0 && (
                                        <div className="ticket-section">
                                            <h2 className="section-title">
                                                Tickets Assigned to Me {statusFilter !== 'ALL'
                                                ? `(${statusFilter})`
                                                : ''}
                                            </h2>
                                            <TicketGrid
                                                tickets={filteredAssignedTickets}
                                                emptyMessage={`You don't have any ${statusFilter !== 'ALL'
                                                    ? statusFilter.toLowerCase() + ' '
                                                    : ''}tickets assigned to you`}
                                            />
                                        </div>
                                    )}

                                    {/* Created tickets section */}
                                    <div className="ticket-section">
                                        <h2 className="section-title">
                                            Tickets Created by Me {statusFilter !== 'ALL'
                                            ? `(${statusFilter})`
                                            : ''}
                                        </h2>
                                        <TicketGrid
                                            tickets={filteredCreatedTickets}
                                            emptyMessage={`You haven't created any ${statusFilter !== 'ALL'
                                                ? statusFilter.toLowerCase() + ' '
                                                : ''}tickets yet`}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Archived assigned tickets section */}
                                    {filteredAssignedArchivedTickets.length > 0 && (
                                        <div className="ticket-section">
                                            <h2 className="section-title">
                                                Archived Tickets Assigned to Me {statusFilter !== 'ALL'
                                                ? `(${statusFilter})`
                                                : ''}
                                            </h2>
                                            <TicketGrid
                                                tickets={filteredAssignedArchivedTickets}
                                                emptyMessage={`No archived ${statusFilter !== 'ALL'
                                                    ? statusFilter.toLowerCase() + ' '
                                                    : ''}tickets assigned to you`}
                                            />
                                        </div>
                                    )}

                                    {/* Archived created tickets section */}
                                    <div className="ticket-section">
                                        <h2 className="section-title">
                                            Archived Tickets Created by Me {statusFilter !== 'ALL'
                                            ? `(${statusFilter})`
                                            : ''}
                                        </h2>
                                        <TicketGrid
                                            tickets={filteredCreatedArchivedTickets}
                                            emptyMessage={`No archived ${statusFilter !== 'ALL'
                                                ? statusFilter.toLowerCase() + ' '
                                                : ''}tickets created by you`}
                                        />
                                    </div>

                                    {/* Load more button for archived tickets */}
                                    {(filteredAssignedArchivedTickets.length > 0 || filteredCreatedArchivedTickets.length > 0) && (
                                        <div className="load-more-container">
                                            <Button
                                                variant="outline"
                                                onClick={handleLoadMore}
                                                className="load-more-button"
                                            >
                                                Load More Tickets
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default DashboardPage;