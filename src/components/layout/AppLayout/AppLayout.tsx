import React, { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { hasAnyRole } from '../../../utils/jwtUtils';
import { UserRole } from '../../../types';
import Avatar from '../../ui/Avatar/Avatar';
import { fetchCurrentUser } from '../../../store/slices/userSlice';
import './AppLayout.css';

interface AppLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
                                                 children,
                                                 showHeader = true,
                                             }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { currentUser, loading } = useSelector((state: RootState) => state.user);

    const isAdmin = hasAnyRole([UserRole.ADMIN]);
    const isSupport = hasAnyRole([UserRole.SUPPORT, UserRole.ADMIN]);

    useEffect(() => {
        if (isAuthenticated && !currentUser && !loading) {
            dispatch(fetchCurrentUser());
        }
    }, [isAuthenticated, currentUser, loading, dispatch]);

    return (
        <div className="app-layout">
            {showHeader && isAuthenticated && (
                <header className="app-header">
                    <div className="container">
                        <div className="app-header-content">
                            <div className="app-logo">
                                <Link to="/dashboard">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    <span>Support App</span>
                                </Link>
                            </div>

                            <nav className="app-nav">
                                <ul className="app-nav-list">
                                    <li className="app-nav-item">
                                        <Link to="/dashboard" className="app-nav-link">
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li className="app-nav-item">
                                        <Link to="/create-ticket" className="app-nav-link">
                                            Create Ticket
                                        </Link>
                                    </li>
                                    {isSupport && (
                                        <li className="app-nav-item">
                                            <Link to="/support/tickets" className="app-nav-link">
                                                Support Tickets
                                            </Link>
                                        </li>
                                    )}
                                    {isAdmin && (
                                        <li className="app-nav-item">
                                            <Link to="/admin" className="app-nav-link">
                                                Admin
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </nav>

                            <div className="app-header-actions">
                                <div className="app-user-menu">
                                    <button className="app-user-button">
                                        <Avatar
                                            name={currentUser?.username || ''}
                                            size="sm"
                                        />
                                        <span className="app-user-name">
                                            {currentUser?.username || 'unknown'}
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="app-user-dropdown">
                                        <div className="app-user-dropdown-header">
                                            <Avatar
                                                name={currentUser?.username || ''}
                                                size="md"
                                            />
                                            <div className="app-user-dropdown-info">
                                                <div className="app-user-dropdown-name">
                                                    {currentUser?.first_name && currentUser?.last_name
                                                        ? `${currentUser.first_name} ${currentUser.last_name}`
                                                        : currentUser?.username}
                                                </div>
                                                <div className="app-user-dropdown-email">
                                                    {currentUser?.email || ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="app-user-dropdown-divider"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <main className="app-main">
                <div className="container">
                    {children}
                </div>
            </main>

            <footer className="app-footer">
                <div className="container">
                    <div className="app-footer-content">
                        <p className="app-footer-copyright">
                            &copy; {new Date().getFullYear()} Support Application
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AppLayout;