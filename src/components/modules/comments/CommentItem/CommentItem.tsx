import React, { useState, useRef, useEffect } from 'react';
import { CommentResponseDto, UserResponseDto } from '../../../../types';
import { formatRelativeTime } from '../../../../utils/dateUtils';
import Avatar from '../../../ui/Avatar/Avatar';
import Button from '../../../ui/Button/Button';
import TextArea from '../../../ui/Form/TextArea';
import ConfirmationDialog from '../../../common/ConfirmationDialog/ConfirmationDialog';
import './CommentItem.css';

interface CommentItemProps {
    comment: CommentResponseDto;
    currentUser: UserResponseDto | null;
    onEdit: (commentId: string, text: string) => void;
    onDelete: (commentId: string) => void;
    isLoading?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
                                                     comment,
                                                     currentUser,
                                                     onEdit,
                                                     onDelete,
                                                     isLoading = false,
                                                 }) => {
    const [showActions, setShowActions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isOwnComment = currentUser?.id === comment.author?.id;

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

    const handleEdit = () => {
        if (!comment.id) return;

        onEdit(comment.id, editText);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditText(comment.text);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (!comment.id) return;

        onDelete(comment.id);
        setShowDeleteConfirm(false);
    };

    const getDisplayName = (user: UserResponseDto | undefined) => {
        if (!user) return 'Unknown User';

        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }

        return user.username;
    };

    return (
        <div className={`comment-item ${isOwnComment ? 'comment-item-own' : ''}`}>
            <div className="comment-header">
                <div className="comment-author">
                    <Avatar
                        name={comment.author?.username || 'Unknown'}
                        size="sm"
                    />
                    <span className="comment-author-name">
            {getDisplayName(comment.author)}
          </span>
                </div>

                <div className="comment-meta">
          <span className="comment-date">
            {formatRelativeTime(comment.created_date)}
          </span>

                    {isOwnComment && !isEditing && (
                        <div className="comment-actions" ref={menuRef}>
                            <button
                                className="comment-actions-toggle"
                                onClick={() => setShowActions(!showActions)}
                                aria-label="Comment actions"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>

                            {showActions && (
                                <div className="comment-actions-dropdown">
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowActions(false);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        className="dropdown-item dropdown-item-danger"
                                        onClick={() => {
                                            setShowDeleteConfirm(true);
                                            setShowActions(false);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="comment-edit">
                    <TextArea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Edit your comment..."
                        disabled={isLoading}
                        className="comment-edit-textarea"
                    />
                    <div className="comment-edit-actions">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleEdit}
                            isLoading={isLoading}
                            disabled={isLoading || !editText.trim()}
                        >
                            Save
                        </Button>
                    </div>
                </div>
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
                isDestructive={true}
                isConfirming={isLoading}
            >
                <p>Are you sure you want to delete this comment?</p>
                <p>This action cannot be undone.</p>
            </ConfirmationDialog>
        </div>
    );
};

export default CommentItem;