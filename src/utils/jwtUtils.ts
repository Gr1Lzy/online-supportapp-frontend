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
        const [, payload] = token.split('.');
        const jsonPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Token decoding error:', error);
        return null;
    }
};

export const getUserRoles = (): string[] => {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const decoded = decodeToken(token);
    return decoded?.roles || [];
};

export const hasRole = (role: UserRole): boolean =>
    getUserRoles().includes(role);

export const hasAnyRole = (roles: UserRole[]): boolean =>
    roles.some(role => getUserRoles().includes(role));