import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommentResponseDto, UserResponseDto } from '../../../types';
import { addComment, fetchTicketById } from '../../../store/slices/ticketSlice';
import { AppDispatch } from '../../../store';
import CommentItem from '../CommentItem/CommentItem';
import { commentService } from '../../../api/services/comment/commentService';
import './CommentSection.css';

interface CommentSectionProps {
    ticketId: string;
    comments: CommentResponseDto[];
    currentUser: UserResponseDto | null;
    loading: boolean;
    error: string | null;
}

const CommentSection = ({
                            ticketId,
                            comments,
                            currentUser,
                            loading,
                            error
                        }: CommentSectionProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            setCommentError(null);
            await dispatch(addComment({
                ticketId,
                commentData: { text: commentText }
            }));
            setCommentText('');
        } catch (error: any) {
            setCommentError(error?.message || 'Failed to add comment');
        }
    };

    const handleUpdateComment = async (commentId: string, text: string) => {
        if (!text.trim() || !commentId) {
            console.error("Invalid comment data:", { commentId, text });
            return;
        }

        try {
            setIsUpdating(true);
            setCommentError(null);

            await commentService.updateComment(commentId, { text });

            await dispatch(fetchTicketById(ticketId));
        } catch (error: any) {
            console.error("Error updating comment:", error);
            setCommentError(error?.message || 'Failed to update comment');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!commentId) {
            console.error("Invalid comment ID for deletion:", commentId);
            return;
        }

        try {
            setCommentError(null);

            await commentService.deleteComment(commentId);

            await dispatch(fetchTicketById(ticketId));
        } catch (error: any) {
            setCommentError(error?.message || 'Failed to delete comment');
        }
    };

    return (
        <div className="comments-section">
            <h3 className="comments-title">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Comments ({comments?.length || 0})
            </h3>

            {commentError && (
                <div className="error-message">
                    {commentError}
                </div>
            )}

            {comments && comments.length > 0 ? (
                <div className="comment-list">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            onEdit={handleUpdateComment}
                            onDelete={handleDeleteComment}
                            loading={loading || isUpdating}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-comments">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p className="no-comments-text">No comments yet</p>
                </div>
            )}

            <div className="add-comment-form">
                <h4 className="form-title">Add a Comment</h4>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type your comment here..."
                    className="comment-textarea"
                    disabled={loading || isUpdating}
                />
                <button
                    onClick={handleAddComment}
                    className="add-comment-button"
                    disabled={loading || isUpdating || !commentText.trim()}
                >
                    {loading || isUpdating ? 'Submitting...' : 'Add Comment'}
                </button>
            </div>
        </div>
    );
};

export default CommentSection;