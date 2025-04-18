import { useState, useRef, useEffect } from 'react';
import { CommentResponseDto, UserResponseDto } from '../../../types';
import { formatRelativeTime } from '../../../utils/dateUtils';
import ConfirmationDialog from '../../common/ConfirmationDialog/ConfirmationDialog';
import CommentForm from '../CommentsForm/CommentsForm';
import './CommentItem.css';

interface CommentItemProps {
    comment: CommentResponseDto;
    currentUser: UserResponseDto | null;
    onEdit: (commentId: string, text: string) => void;
    onDelete: (commentId: string) => void;
    loading: boolean;
}

const CommentItem = ({ comment, currentUser, onEdit, onDelete, loading }: CommentItemProps) => {
    const [showActions, setShowActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isOwnComment = currentUser?.id === comment.author?.id;

    // Handle clicks outside of the dropdown menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEdit = (text: string) => {
        onEdit(comment.id, text);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(comment.id);
        setShowDeleteConfirm(false);
    };

    const getUserInitials = (user: UserResponseDto | undefined) => {
        if (!user) return '?';

        if (user.first_name && user.last_name) {
            return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
        }

        return user.username.charAt(0).toUpperCase();
    };

    return (
        <div className={`comment-item ${isOwnComment ? 'own-comment' : ''}`}>
            <div className="comment-header">
                <div className="comment-author">
                    <div className="comment-author-avatar">
                        {getUserInitials(comment.author)}
                    </div>
                    <span>{comment.author?.username || 'Unknown User'}</span>
                </div>
                <div className="comment-meta">
                    <span className="comment-date">{formatRelativeTime(comment.created_date)}</span>

                    {isOwnComment && !isEditing && (
                        <div className="comment-actions-menu" ref={menuRef}>
                            <button
                                className="comment-actions-button"
                                onClick={() => setShowActions(!showActions)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>

                            {showActions && (
                                <div className="comment-actions-dropdown">
                                    <div
                                        className="dropdown-item"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowActions(false);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </div>
                                    <div
                                        className="dropdown-item danger"
                                        onClick={() => {
                                            setShowDeleteConfirm(true);
                                            setShowActions(false);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isEditing ? (
                <CommentForm
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    initialText={comment.text}
                    loading={loading}
                    isEditing={true}
                />
            ) : (
                <div className="comment-body">
                    {comment.text}
                </div>
            )}

            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                title="Delete Comment"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
            >
                <p>Are you sure you want to delete this comment?</p>
                <p>This action cannot be undone.</p>
            </ConfirmationDialog>
        </div>
    );
};

export default CommentItem;