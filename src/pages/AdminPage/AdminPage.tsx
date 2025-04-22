import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserRole } from '../../types';
import { hasAnyRole } from '../../utils/jwtUtils';
import {
    fetchAdminUsers,
} from '../../store/slices/adminSlice';
import { AppDispatch, RootState } from '../../store';
import AdminUserList from '../../components/common/AdminUserList/AdminUserList';
import UserRegistrationForm from '../UserRegistrationForm/UserRegistrationForm';
import './AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

    const { users, error, loading } = useSelector((state: RootState) => state.admin);

    useEffect(() => {
        const isAdmin = hasAnyRole([UserRole.ADMIN]);
        if (!isAdmin) {
            navigate('/dashboard');
            return;
        }

        dispatch(fetchAdminUsers({ page: 0, size: 10 }));
    }, [navigate, dispatch]);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleRegisterSuccess = () => {
        setActiveTab('list');
        dispatch(fetchAdminUsers({ page: 0, size: 10 }));
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">Admin Dashboard</h1>
                <div className="header-actions">
                    <button className="back-button" onClick={handleBackToDashboard}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="admin-tabs">
                <button
                    className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    User Management
                </button>
                <button
                    className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => setActiveTab('add')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register New User
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {activeTab === 'list' && (
                <AdminUserList users={users} error={error} />
            )}

            {activeTab === 'add' && (
                <UserRegistrationForm onSuccess={handleRegisterSuccess} />
            )}

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;