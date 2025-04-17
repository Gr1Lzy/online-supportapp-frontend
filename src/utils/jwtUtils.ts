import { UserRole } from '../types';

interface DecodedToken {
    sub: string;
    iat: number;
    exp: number;
    roles: string[];
    [key: string]: any;
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        // Split the token into parts
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (middle part)
        const payload = parts[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = decodeURIComponent(
            atob(normalized)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const getUserRoles = (): string[] => {
    const token = localStorage.getItem('token');
    if (!token) {
        return [];
    }

    const decoded = decodeToken(token);
    if (!decoded) {
        return [];
    }

    return decoded.roles || [];
};

export const hasRole = (role: UserRole): boolean => {
    const roles = getUserRoles();
    return roles.includes(role);
};

export const hasAnyRole = (roles: UserRole[]): boolean => {
    const userRoles = getUserRoles();
    return roles.some(role => userRoles.includes(role));
};