import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommentResponseDto, UserResponseDto, CommentCreateRequestDto } from '../../../types';
import { addComment, updateComment, deleteComment } from '../../../store/slices/ticketSlice';
import { AppDispatch } from '../../../store';
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
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            setCommentError(null);
            await dispatch(addComment({
                ticketId,
                commentData: { text: commentText }
            })).unwrap();
            setCommentText('');
        } catch (error: any) {
            setCommentError(error || 'Failed to add comment');
        }
    };

    const handleUpdateComment = async (commentId: string) => {
        if (!editText.trim()) return;

        try {
            setCommentError(null);
            await dispatch(updateComment({
                commentId,
                commentData: { text: editText }
            })).unwrap();
            setEditingCommentId(null);
            setEditText('');
        } catch (error: any) {
            setCommentError(error || 'Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            setCommentError(null);
            await dispatch(deleteComment({
                commentId,
                ticketId
            })).unwrap();
        } catch (error: any) {
            setCommentError(error || 'Failed to delete comment');
        }
    };

    const startEditingComment = (comment: CommentResponseDto) => {
        setEditingCommentId(comment.id);
        setEditText(comment.text);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditText('');
    };

    const getUserInitials = (user: UserResponseDto | undefined) => {
        if (!user) return '?';

        if (user.first_name && user.last_name) {
            return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
        }

        return user.username.charAt(0).toUpperCase();
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
                    {comments.map(comment => {
                        // Check if this specific comment is being edited
                        const isEditing = editingCommentId === comment.id;
                        const isOwnComment = currentUser?.id === comment.author?.id;

                        return (
                            <div key={comment.id} className={`comment-item ${isOwnComment ? 'own-comment' : ''}`}>
                                <div className="comment-header">
                                    <div className="comment-author">
                                        <div className="comment-author-avatar">
                                            {getUserInitials(comment.author)}
                                        </div>
                                        <span>{comment.author?.username || 'Unknown User'}</span>
                                    </div>
                                    <div className="comment-meta">
                                        <span className="comment-date">
                                            {new Date(comment.created_date).toLocaleDateString()}
                                            {' '}
                                            {new Date(comment.created_date).toLocaleTimeString()}
                                        </span>

                                        {isOwnComment && !isEditing && (
                                            <div className="comment-actions">
                                                <button
                                                    onClick={() => startEditingComment(comment)}
                                                    className="action-button"
                                                    disabled={loading || editingCommentId !== null}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="action-button delete"
                                                    disabled={loading || editingCommentId !== null}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="edit-comment-form">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="edit-textarea"
                                            disabled={loading}
                                        />
                                        <div className="edit-actions">
                                            <button
                                                onClick={cancelEditing}
                                                className="cancel-button"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleUpdateComment(comment.id)}
                                                className="save-button"
                                                disabled={loading || !editText.trim()}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="comment-body">
                                        {comment.text}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
                    disabled={loading || editingCommentId !== null}
                />
                <button
                    onClick={handleAddComment}
                    className="add-comment-button"
                    disabled={loading || !commentText.trim() || editingCommentId !== null}
                >
                    {loading ? 'Submitting...' : 'Add Comment'}
                </button>
            </div>
        </div>
    );
};

export default CommentSection;