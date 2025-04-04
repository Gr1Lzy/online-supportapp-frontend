import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PageDto, StatusRequestDto, TicketRequestDto, TicketResponseDto, UserIdRequestDto} from '../../types';
import {ticketService} from "../../api/services/ticket-service/ticket.service.ts";
import {supportTicketService} from "../../api/services/ticket-service/support.ticket.service.ts";

interface TicketState {
    tickets: TicketResponseDto[];
    currentTicket: TicketResponseDto | null;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: TicketState = {
    tickets: [],
    currentTicket: null,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    hasNext: false,
    loading: false,
    error: null,
};

export const fetchTickets = createAsyncThunk(
    'tickets/fetchAll',
    async ({ page = 0, size = 10 }: { page?: number; size?: number }, { rejectWithValue }) => {
        try {
            return await ticketService.getAll(page, size);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
        }
    }
);

export const fetchTicketById = createAsyncThunk(
    'tickets/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            return await ticketService.getByTicketId(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ticket');
        }
    }
);

export const createTicket = createAsyncThunk<void, TicketRequestDto>(
    'tickets/create',
    async (ticketData, { rejectWithValue }) => {
        try {
            await ticketService.createTicket(ticketData);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
        }
    }
);

export const assignTicketToMe = createAsyncThunk(
    'tickets/assignToMe',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            await ticketService.assignTicketOnCurrentUser(ticketId);
            return ticketId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign ticket');
        }
    }
);

export const assignTicketToUser = createAsyncThunk(
    'tickets/assignToUser',
    async ({ ticketId, userId }: { ticketId: string; userId: UserIdRequestDto }, { rejectWithValue }) => {
        try {
            await supportTicketService.assignOnUser(ticketId, userId);
            return { ticketId, userId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to assign ticket to user');
        }
    }
);

export const unassignTicket = createAsyncThunk(
    'tickets/unassign',
    async (ticketId: string, { rejectWithValue }) => {
        try {
            await supportTicketService.unassignUser(ticketId);
            return ticketId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to unassign ticket');
        }
    }
);

export const updateTicketStatus = createAsyncThunk(
    'tickets/updateStatus',
    async ({ ticketId, status }: { ticketId: string; status: StatusRequestDto }, { rejectWithValue }) => {
        try {
            await supportTicketService.updateStatus(ticketId, status);
            return { ticketId, status };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update ticket status');
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        clearCurrentTicket: (state) => {
            state.currentTicket = null;
        },
        clearTickets: (state) => {
            state.tickets = [];
            state.currentTicket = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTickets.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTickets.fulfilled, (state, action: PayloadAction<PageDto<TicketResponseDto>>) => {
            state.loading = false;
            state.tickets = action.payload.content;
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.size;
            state.hasNext = action.payload.has_next;
        });
        builder.addCase(fetchTickets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchTicketById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchTicketById.fulfilled, (state, action: PayloadAction<TicketResponseDto>) => {
            state.loading = false;
            state.currentTicket = action.payload;
        });
        builder.addCase(fetchTicketById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(createTicket.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createTicket.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(createTicket.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Assign ticket to me
        builder.addCase(assignTicketToMe.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(assignTicketToMe.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(assignTicketToMe.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(assignTicketToUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(assignTicketToUser.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(assignTicketToUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(unassignTicket.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(unassignTicket.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(unassignTicket.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(updateTicketStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateTicketStatus.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(updateTicketStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearCurrentTicket, clearTickets } = ticketSlice.actions;
export default ticketSlice.reducer;