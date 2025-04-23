import React, { useState } from 'react';
import { CommentResponseDto, UserResponseDto } from '../../../../types';
import CommentItem from '../CommentItem/CommentItem';
import TextArea from '../../../ui/Form/TextArea';
import Button from '../../../ui/Button/Button';
import Alert from '../../../ui/Alert/Alert';
import './CommentSection.css';

interface CommentSectionProps {
    ticketId: string;
    comments: CommentResponseDto[];
    currentUser: UserResponseDto | null;
    isLoading?: boolean;
    error?: string | null;
    onAddComment: (ticketId: string, text: string) => Promise<void | any>;
    onUpdateComment: (commentId: string, text: string) => Promise<void | any>;
    onDeleteComment: (commentId: string) => Promise<void | any>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
                                                           ticketId,
                                                           comments,
                                                           currentUser,
                                                           isLoading = false,
                                                           error = null,
                                                           onAddComment,
                                                           onUpdateComment,
                                                           onDeleteComment,
                                                       }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            setIsSubmitting(true);
            await onAddComment(ticketId, commentText);
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateComment = async (commentId: string, text: string) => {
        try {
            await onUpdateComment(commentId, text);
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await onDeleteComment(commentId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="comment-section">
            <h3 className="comment-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Comments ({comments?.length || 0})
            </h3>

            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    className="comment-section-error"
                >
                    {error}
                </Alert>
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
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            ) : (
                <div className="comment-section-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p>No comments yet</p>
                </div>
            )}

            <div className="comment-form">
                <h4 className="comment-form-title">Add a Comment</h4>
                <TextArea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type your comment here..."
                    disabled={isLoading || isSubmitting}
                    className="comment-form-textarea"
                />
                <div className="comment-form-actions">
                    <Button
                        onClick={handleAddComment}
                        disabled={isLoading || isSubmitting || !commentText.trim()}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Comment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommentSection;