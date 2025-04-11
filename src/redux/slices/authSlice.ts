import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthRequestDto, AuthResponseDto, UserCreateRequestDto, UserResponseDto} from '../../types';
import {authApi} from "../../api/services/user-services/auth.service.ts";

interface AuthState {
    isAuthenticated: boolean;
    user: UserResponseDto | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

// Initialize state with values from localStorage if available
const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: AuthRequestDto, { rejectWithValue }) => {
        try {
            return await authApi.login(credentials);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
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
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
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
            return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
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
            state.token = access_token;
            state.refreshToken = refresh_token;
            state.isAuthenticated = true;

            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
        },
        clearCredentials: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;

            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
        setUser: (state, action: PayloadAction<UserResponseDto>) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.access_token;
            state.refreshToken = action.payload.refresh_token;

            localStorage.setItem('token', action.payload.access_token);
            localStorage.setItem('refreshToken', action.payload.refresh_token);
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.token = action.payload.access_token;
            state.refreshToken = action.payload.refresh_token;
            state.isAuthenticated = true;

            localStorage.setItem('token', action.payload.access_token);
            localStorage.setItem('refreshToken', action.payload.refresh_token);
        });
        builder.addCase(refreshToken.rejected, (state) => {
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;

            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;

            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        });
    },
});

export const { setCredentials, clearCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;