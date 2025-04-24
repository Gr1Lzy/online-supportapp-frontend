import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../store/slices/adminSlice';
import { AppDispatch, RootState } from '../../store';
import { UserRole } from '../../types';
import { hasAnyRole } from '../../utils/jwtUtils';

import Container from '../../components/layout/Container/Container';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import Alert from '../../components/ui/Alert/Alert';
import Spinner from '../../components/ui/Spinner/Spinner';
import AdminUserList from '../../components/common/AdminUserList/AdminUserList';
import UserRegistrationForm from '../../components/common/UserRegistrationForm/UserRegistrationForm';
import Tabs from '../../components/ui/Tabs/Tabs';
import Tab from '../../components/ui/Tabs/Tab';

import './AdminPage.css';

const AdminPage: React.FC = () => {
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
        <Container>
            <PageHeader
                title="Admin Dashboard"
                actions={
                    <Button
                        variant="outline"
                        onClick={handleBackToDashboard}
                    >
                        Back to Dashboard
                    </Button>
                }
            />

            <Tabs className="admin-tabs">
                <Tab
                    id="list"
                    label="User Management"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    }
                    isActive={activeTab === 'list'}
                    onClick={() => setActiveTab('list')}
                />
                <Tab
                    id="add"
                    label="Register New User"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    }
                    isActive={activeTab === 'add'}
                    onClick={() => setActiveTab('add')}
                />
            </Tabs>

            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            {loading && (
                <div className="admin-loading">
                    <Spinner size="lg" />
                    <p>Loading...</p>
                </div>
            )}

            {!loading && (
                <>
                    {activeTab === 'list' && (
                        <Card className="admin-card">
                            <AdminUserList users={users} error={error} />
                        </Card>
                    )}

                    {activeTab === 'add' && (
                        <UserRegistrationForm onSuccess={handleRegisterSuccess} />
                    )}
                </>
            )}
        </Container>
    );
};

export default AdminPage;