import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PageDto, PasswordRequestDto, UserResponseDto} from '../../types';
import {userService} from "../../api/services/user/userService";
import {setUser} from './authSlice';
import {handleApiError, setPending, setRejected} from '../../utils/reduxHelpers';

interface UserState {
    currentUser: UserResponseDto | null;
    users: UserResponseDto[];
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    users: [],
    currentPage: 0,
    pageSize: 10,
    hasNext: false,
    loading: false,
    error: null,
};

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrent',
    async (_, {dispatch, rejectWithValue}) => {
        try {
            const userData = await userService.getCurrentUser();
            dispatch(setUser(userData));
            return userData;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to fetch current user'));
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'user/fetchById',
    async (id: string, {rejectWithValue}) => {
        try {
            return await userService.getUserById(id);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to fetch user'));
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    'user/fetchAll',
    async ({page = 0, size = 10}: { page?: number; size?: number }, {rejectWithValue}) => {
        try {
            return await userService.getAllUsers(page, size);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to fetch users'));
        }
    }
);

export const updatePassword = createAsyncThunk(
    'user/updatePassword',
    async (passwordData: PasswordRequestDto, {rejectWithValue}) => {
        try {
            await userService.updatePassword(passwordData);
            return true;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to update password'));
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        clearUsers: (state) => {
            state.users = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentUser.pending, setPending);
        builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<UserResponseDto>) => {
            state.loading = false;
            state.currentUser = action.payload;
        });
        builder.addCase(fetchCurrentUser.rejected, setRejected);

        builder.addCase(fetchUserById.pending, setPending);
        builder.addCase(fetchUserById.fulfilled, (state, action: PayloadAction<UserResponseDto>) => {
            state.loading = false;
            if (!state.users.some(user => user.id === action.payload.id)) {
                state.users.push(action.payload);
            }
        });
        builder.addCase(fetchUserById.rejected, setRejected);

        builder.addCase(fetchAllUsers.pending, setPending);
        builder.addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<PageDto<UserResponseDto>>) => {
            state.loading = false;
            state.users = action.payload.content;
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.size;
            state.hasNext = action.payload.has_next;
        });
        builder.addCase(fetchAllUsers.rejected, setRejected);

        builder.addCase(updatePassword.pending, setPending);
        builder.addCase(updatePassword.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updatePassword.rejected, setRejected);
    },
});

export const {clearCurrentUser, clearUsers} = userSlice.actions;
export default userSlice.reducer;