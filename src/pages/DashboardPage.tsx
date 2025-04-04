import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { fetchCurrentUser } from '../redux/slices/userSlice';
import { AppDispatch, RootState } from '../redux/store';

const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentUser, loading } = useSelector((state: RootState) => state.user);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCurrentUser());
        } else {
            navigate('/');
        }
    }, [dispatch, isAuthenticated, navigate]);

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/');
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
        },
        logoutContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Dashboard</h1>
                <div>
                    <button style={styles.button} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                <h2>Welcome to the Support Application</h2>
                <p>Here you can view your account details and manage your support tickets.</p>

                {loading ? (
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
            </div>
        </div>
    );
};

export default DashboardPage;