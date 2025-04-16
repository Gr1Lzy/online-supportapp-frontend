import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthRequestDto, AuthResponseDto, UserCreateRequestDto, UserResponseDto } from '../../types';
import { authApi } from "../../api/services/auth/authService";
import { handleApiError, setPending, setRejected } from '../../utils/reduxHelpers';

interface AuthState {
    isAuthenticated: boolean;
    user: UserResponseDto | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    loading: false,
    error: null,
};

const clearAuthState = (state: AuthState) => {
    state.token = null;
    state.refreshToken = null;
    state.isAuthenticated = false;
    state.user = null;

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

const setAuthTokens = (state: AuthState, accessToken: string, refreshToken: string) => {
    state.token = accessToken;
    state.refreshToken = refreshToken;
    state.isAuthenticated = true;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: AuthRequestDto, { rejectWithValue }) => {
        try {
            return await authApi.login(credentials);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Login failed'));
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: UserCreateRequestDto, { rejectWithValue }) => {
        try {
            await authApi.register(userData);
            return true;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Registration failed'));
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { auth: AuthState };
        const currentRefreshToken = state.auth.refreshToken;

        if (!currentRefreshToken) {
            return rejectWithValue('No refresh token available');
        }

        try {
            return await authApi.refreshToken(currentRefreshToken);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Token refresh failed'));
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            authApi.logout();
            return true;
        } catch (error: any) {
            return rejectWithValue('Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthResponseDto>) => {
            const { access_token, refresh_token } = action.payload;
            setAuthTokens(state, access_token, refresh_token);
        },
        clearCredentials: (state) => {
            clearAuthState(state);
        },
        setUser: (state, action: PayloadAction<UserResponseDto>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, setPending);
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            const { access_token, refresh_token } = action.payload;
            setAuthTokens(state, access_token, refresh_token);
        });
        builder.addCase(login.rejected, setRejected);

        builder.addCase(register.pending, setPending);
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(register.rejected, setRejected);

        builder.addCase(refreshToken.fulfilled, (state, action) => {
            const { access_token, refresh_token } = action.payload;
            setAuthTokens(state, access_token, refresh_token);
        });
        builder.addCase(refreshToken.rejected, clearAuthState);

        builder.addCase(logout.fulfilled, clearAuthState);
    },
});

export const { setCredentials, clearCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;