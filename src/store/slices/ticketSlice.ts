import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    CommentCreateRequestDto,
    PageDto,
    StatusRequestDto,
    TicketRequestDto,
    TicketResponseDto,
    TicketStatus,
    UserIdRequestDto
} from '../../types';
import {ticketService} from "../../api/services/ticket/ticketService";
import {supportTicketService} from "../../api/services/ticket/supportTicketService";
import {commentService} from "../../api/services/comment/commentService";
import {handleApiError, setPending, setRejected} from '../../utils/reduxHelpers';

interface TicketState {
    tickets: TicketResponseDto[];
    myCreatedTickets: TicketResponseDto[];
    myAssignedTickets: TicketResponseDto[];
    currentTicket: TicketResponseDto | null;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    loading: boolean;
    error: string | null;
    currentFilter: TicketStatus | 'ALL';
}

const initialState: TicketState = {
    tickets: [],
    myCreatedTickets: [],
    myAssignedTickets: [],
    currentTicket: null,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,
    hasNext: false,
    loading: false,
    error: null,
    currentFilter: 'ALL',
};

const createTicketThunk = <T, R>(
    typePrefix: string,
    payloadCreator: (arg: T, {rejectWithValue, dispatch}: any) => Promise<R>,
    defaultErrorMessage: string
) => {
    return createAsyncThunk(
        typePrefix,
        async (arg: T, {rejectWithValue, dispatch}) => {
            try {
                return await payloadCreator(arg, {rejectWithValue, dispatch});
            } catch (error: any) {
                return rejectWithValue(handleApiError(error, defaultErrorMessage));
            }
        }
    );
};

export const fetchTickets = createTicketThunk<
    { page?: number; size?: number },
    PageDto<TicketResponseDto>
>(
    'tickets/fetchAll',
    async ({page = 0, size = 10}) => await ticketService.getAll(page, size),
    'Failed to fetch tickets'
);

export const fetchMyCreatedTickets = createTicketThunk<
    { page?: number; size?: number },
    PageDto<TicketResponseDto>
>(
    'tickets/fetchMyCreated',
    async ({page = 0, size = 10}) => await ticketService.getMyCreatedTickets(page, size),
    'Failed to fetch your created tickets'
);

export const fetchMyAssignedTickets = createTicketThunk<
    { page?: number; size?: number },
    PageDto<TicketResponseDto>
>(
    'tickets/fetchMyAssigned',
    async ({page = 0, size = 10}) => await ticketService.getMyAssignedTickets(page, size),
    'Failed to fetch tickets assigned to you'
);

export const fetchTicketById = createTicketThunk<
    string,
    TicketResponseDto
>(
    'tickets/fetchById',
    async (id) => await ticketService.getByTicketId(id),
    'Failed to fetch ticket'
);

export const createTicket = createTicketThunk<
    TicketRequestDto,
    void
>(
    'tickets/create',
    async (ticketData) => await ticketService.createTicket(ticketData),
    'Failed to create ticket'
);

export const assignTicketToMe = createTicketThunk<
    string,
    string
>(
    'tickets/assignToMe',
    async (ticketId, {dispatch}) => {
        await ticketService.assignTicketOnCurrentUser(ticketId);
        dispatch(fetchTicketById(ticketId));
        return ticketId;
    },
    'Failed to assign ticket'
);

export const assignTicketToUser = createTicketThunk<
    { ticketId: string; userId: UserIdRequestDto },
    { ticketId: string; userId: UserIdRequestDto }
>(
    'tickets/assignToUser',
    async ({ticketId, userId}, {dispatch}) => {
        await supportTicketService.assignOnUser(ticketId, userId);
        dispatch(fetchTicketById(ticketId));
        return {ticketId, userId};
    },
    'Failed to assign ticket to user'
);

export const unassignTicket = createTicketThunk<
    string,
    string
>(
    'tickets/unassign',
    async (ticketId, {dispatch}) => {
        await supportTicketService.unassignUser(ticketId);
        dispatch(fetchTicketById(ticketId));
        return ticketId;
    },
    'Failed to unassign ticket'
);

export const updateTicketStatus = createTicketThunk<
    { ticketId: string; status: StatusRequestDto },
    { ticketId: string; status: StatusRequestDto }
>(
    'tickets/updateStatus',
    async ({ticketId, status}, {dispatch}) => {
        await supportTicketService.updateStatus(ticketId, status);
        dispatch(fetchTicketById(ticketId));
        return {ticketId, status};
    },
    'Failed to update ticket status'
);

export const addComment = createTicketThunk<
    { ticketId: string; commentData: CommentCreateRequestDto },
    void
>(
    'tickets/addComment',
    async ({ticketId, commentData}, {dispatch}) => {
        await commentService.addComment(ticketId, commentData);
        dispatch(fetchTicketById(ticketId));
    },
    'Failed to add comment'
);

export const updateComment = createTicketThunk<
    { commentId: string; commentData: CommentCreateRequestDto },
    void
>(
    'tickets/updateComment',
    async ({commentId, commentData}, {dispatch, getState}) => {
        await commentService.updateComment(commentId, commentData);
        const state = getState() as any;
        const ticketId = state.tickets.currentTicket?.id;
        if (ticketId) {
            dispatch(fetchTicketById(ticketId));
        }
    },
    'Failed to update comment'
);

export const deleteComment = createTicketThunk<
    { commentId: string; ticketId: string },
    void
>(
    'tickets/deleteComment',
    async ({commentId, ticketId}, {dispatch}) => {
        await commentService.deleteComment(commentId);
        dispatch(fetchTicketById(ticketId));
    },
    'Failed to delete comment'
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
            state.myCreatedTickets = [];
            state.myAssignedTickets = [];
            state.currentTicket = null;
        },
        updateAssignmentStatus: (state, action: PayloadAction<{
            ticketId: string,
            assignedToCurrentUser: boolean
        }>) => {
            if (state.currentTicket && state.currentTicket.id === action.payload.ticketId) {
                console.log(`Updating assignment status to ${action.payload.assignedToCurrentUser}`);
            }
        },
        setStatusFilter: (state, action: PayloadAction<TicketStatus | 'ALL'>) => {
            state.currentFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTickets.pending, setPending);
        builder.addCase(fetchTickets.fulfilled, (state, action: PayloadAction<PageDto<TicketResponseDto>>) => {
            state.loading = false;
            state.tickets = action.payload.content;
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.size;
            state.hasNext = action.payload.has_next;
        });
        builder.addCase(fetchTickets.rejected, setRejected);

        builder.addCase(fetchMyCreatedTickets.pending, setPending);
        builder.addCase(fetchMyCreatedTickets.fulfilled, (state, action: PayloadAction<PageDto<TicketResponseDto>>) => {
            state.loading = false;
            state.myCreatedTickets = action.payload.content;
        });
        builder.addCase(fetchMyCreatedTickets.rejected, setRejected);

        builder.addCase(fetchMyAssignedTickets.pending, setPending);
        builder.addCase(fetchMyAssignedTickets.fulfilled, (state, action: PayloadAction<PageDto<TicketResponseDto>>) => {
            state.loading = false;
            state.myAssignedTickets = action.payload.content;
        });
        builder.addCase(fetchMyAssignedTickets.rejected, setRejected);

        builder.addCase(fetchTicketById.pending, setPending);
        builder.addCase(fetchTicketById.fulfilled, (state, action: PayloadAction<TicketResponseDto>) => {
            state.loading = false;
            state.currentTicket = action.payload;
        });
        builder.addCase(fetchTicketById.rejected, setRejected);

        builder.addCase(createTicket.pending, setPending);
        builder.addCase(createTicket.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(createTicket.rejected, setRejected);

        [
            assignTicketToMe,
            assignTicketToUser,
            unassignTicket,
            updateTicketStatus,
            addComment,
            updateComment,
            deleteComment
        ].forEach(thunk => {
            builder.addCase(thunk.pending, setPending);
            builder.addCase(thunk.fulfilled, (state) => {
                state.loading = false;
            });
            builder.addCase(thunk.rejected, setRejected);
        });
    },
});

export const {clearCurrentTicket, clearTickets, updateAssignmentStatus, setStatusFilter} = ticketSlice.actions;
export default ticketSlice.reducer;