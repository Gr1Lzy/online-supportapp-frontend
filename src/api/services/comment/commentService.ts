import clients from '../api/clients.ts';
import { CommentCreateRequestDto } from "../../../types";

export const commentService = {
    addComment: async (ticketId: string, commentData: CommentCreateRequestDto): Promise<void> => {
        await clients.post<void>(`/api/comments/${ticketId}`, commentData);
    },

    updateComment: async (commentId: string, commentData: CommentCreateRequestDto): Promise<void> => {
        await clients.patch<void>(`/api/comments/${commentId}`, commentData);
    },

    deleteComment: async (commentId: string): Promise<void> => {
        await clients.delete<void>(`/api/comments/${commentId}`);
    }
};