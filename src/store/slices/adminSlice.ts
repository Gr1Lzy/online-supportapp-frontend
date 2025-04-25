import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    PageDto,
    AdminUserResponseDto,
    UserCreateRequestDto,
    UserUpdateRequestDto,
    UserRole,
    RoleRequestDto
} from '../../types';
import { adminUserService } from '../../api/services/user/adminUserService';
import { authApi } from '../../api/services/auth/authService';
import { handleApiError } from '../../utils/reduxHelpers';

interface AdminState {
    users: AdminUserResponseDto[];
    currentUser: AdminUserResponseDto | null;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    users: [],
    currentUser: null,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    hasNext: false,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    'admin/registerUser',
    async (userData: UserCreateRequestDto, { rejectWithValue, dispatch }) => {
        try {
            await authApi.register(userData);

            await dispatch(fetchAdminUsers({ page: 0, size: 10 }));

            return { success: true };
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to register user'));
        }
    }
);

export const fetchAdminUsers = createAsyncThunk(
    'admin/fetchUserList',
    async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
        try {
            return await adminUserService.getAllUsers(page, size);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to fetch users'));
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'admin/fetchUserById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await adminUserService.getUserById(id);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to fetch user'));
        }
    }
);

export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({
               id,
               userData,
               roles
           }: {
        id: string;
        userData: UserUpdateRequestDto;
        roles?: UserRole[]
    }, { rejectWithValue, dispatch }) => {
        try {
            await adminUserService.updateUser(id, userData);

            if (roles && roles.length > 0) {
                const roleRequests = roles.map(role =>
                    dispatch(assignRole({
                        userId: id,
                        role: { role }
                    }))
                );
                await Promise.all(roleRequests);
            }

            await dispatch(fetchAdminUsers({ page: 0, size: 10 }));

            return { success: true };
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to update user'));
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            await adminUserService.deleteUser(id);

            await dispatch(fetchAdminUsers({ page: 0, size: 10 }));

            return id;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to delete user'));
        }
    }
);

export const assignRole = createAsyncThunk(
    'admin/assignRole',
    async ({
               userId,
               role
           }: {
        userId: string;
        role: RoleRequestDto
    }, { rejectWithValue }) => {
        try {
            await adminUserService.assignRole(userId, role);
            return { userId, role };
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to assign role'));
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearUsers: (state) => {
            state.users = [];
        },
        clearCurrentUser: (state) => {
            state.currentUser = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchAdminUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAdminUsers.fulfilled, (state, action: PayloadAction<PageDto<AdminUserResponseDto>>) => {
            state.loading = false;
            state.users = action.payload.content;
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.size;
            state.hasNext = action.payload.has_next;
        });
        builder.addCase(fetchAdminUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchUserById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUserById.fulfilled, (state, action: PayloadAction<AdminUserResponseDto>) => {
            state.loading = false;
            state.currentUser = action.payload;
        });
        builder.addCase(fetchUserById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateUser.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = state.users.filter(user => user.id !== action.payload);
        });
        builder.addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(assignRole.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(assignRole.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(assignRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { clearUsers, clearCurrentUser } = adminSlice.actions;
export default adminSlice.reducer;