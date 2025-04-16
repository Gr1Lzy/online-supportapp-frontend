import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isAuthenticated && !token) {
            console.error('Token is missing despite authenticated status');
            dispatch(logout());
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, token, dispatch, navigate]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;