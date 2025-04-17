import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { UserRole } from '../../types';
import { hasAnyRole } from '../../utils/jwtUtils';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: UserRole[];
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isAuthenticated && !token) {
            console.error('Token is missing despite authenticated status');
            dispatch(logout());
            navigate('/', { replace: true });
        }

        if (isAuthenticated && requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = hasAnyRole(requiredRoles);
            if (!hasRequiredRole) {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, token, dispatch, navigate, requiredRoles]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;