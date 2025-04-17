import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PageDto, StatusRequestDto, TicketResponseDto, UserIdRequestDto, UserResponseDto} from '../../types';
import {ticketService} from "../../api/services/ticket/ticketService";
import {supportTicketService} from "../../api/services/ticket/supportTicketService";
import {userService} from "../../api/services/user/userService";
import {handleApiError, setRejected} from '../../utils/reduxHelpers';
import {fetchTicketById} from "./ticketSlice.ts";

interface SupportState {
    allTickets: TicketResponseDto[];
    users: UserResponseDto[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    loading: boolean;
    loadingUsers: boolean;
    error: string | null;
}

const initialState: SupportState = {
    allTickets: [],
    users: [],
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    hasNext: false,
    loading: false,
    loadingUsers: false,
    error: null,
};

export const fetchAllTickets = createAsyncThunk(
    'support/fetchAllTickets',
    async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
        try {
            return await ticketService.getAll(page, size);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to fetch tickets'));
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'support/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getAllUsers(0, 100);
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to fetch users'));
        }
    }
);

export const assignTicketToUser = createAsyncThunk(
    'support/assignTicketToUser',
    async ({ ticketId, userId }: { ticketId: string; userId: UserIdRequestDto }, { rejectWithValue }) => {
        try {
            await supportTicketService.assignOnUser(ticketId, userId);
            return { ticketId, userId };
        } catch (error: any) {
            console.error('Error assigning ticket:', error);
            return rejectWithValue(handleApiError(error, 'Failed to assign ticket to user'));
        }
    }
);

export const unassignTicket = createAsyncThunk(
    'support/unassignTicket',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            await supportTicketService.unassignUser(ticketId);
            return ticketId;
        } catch (error: any) {
            return rejectWithValue(handleApiError(error, 'Failed to unassign ticket'));
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'tickets/updateStatus',
    async ({ ticketId, status }: { ticketId: string; status: StatusRequestDto }, { rejectWithValue, dispatch }) => {
        try {
            await supportTicketService.updateStatus(ticketId, status);

            await dispatch(fetchTicketById(ticketId)).unwrap();

            return { ticketId, status };
        } catch (error: any) {
            console.error('Status update error:', error);
            return rejectWithValue(handleApiError(error, 'Failed to update ticket status'));
        }
    }
);

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        clearAllTickets: (state) => {
            state.allTickets = [];
        },
        clearUsers: (state) => {
            state.users = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllTickets.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllTickets.fulfilled, (state, action: PayloadAction<PageDto<TicketResponseDto>>) => {
            state.loading = false;
            if (action.payload.page === 0) {
                state.allTickets = action.payload.content;
            } else {
                // Append new tickets to the existing list, avoiding duplicates
                const existingIds = new Set(state.allTickets.map(ticket => ticket.id));
                const newTickets = action.payload.content.filter(ticket => !existingIds.has(ticket.id));
                state.allTickets = [...state.allTickets, ...newTickets];
            }
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.size;
            state.hasNext = action.payload.has_next;
        });
        builder.addCase(fetchAllTickets.rejected, setRejected);

        // Handle fetchUsers
        builder.addCase(fetchUsers.pending, (state) => {
            state.loadingUsers = true;
            state.error = null;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<PageDto<UserResponseDto>>) => {
            state.loadingUsers = false;
            state.users = action.payload.content;
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.loadingUsers = false;
            state.error = action.payload as string;
        });

        // Handle assignTicketToUser, unassignTicket, updateTicketStatus
        [assignTicketToUser, unassignTicket, updateTicketStatus].forEach(thunk => {
            builder.addCase(thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(thunk.fulfilled, (state) => {
                state.loading = false;
            });
            builder.addCase(thunk.rejected, setRejected);
        });
    }
});

export const { clearAllTickets, clearUsers } = supportSlice.actions;
export default supportSlice.reducer;