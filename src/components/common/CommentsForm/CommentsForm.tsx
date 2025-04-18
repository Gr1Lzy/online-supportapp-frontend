import { useState, FormEvent } from 'react';
import './CommentForm.css';

interface CommentFormProps {
    onSubmit: (text: string) => void;
    onCancel?: () => void;
    initialText?: string;
    loading?: boolean;
    isEditing?: boolean;
    error?: string | null;
}

const CommentForm = ({
                         onSubmit,
                         onCancel,
                         initialText = '',
                         loading = false,
                         isEditing = false,
                         error = null
                     }: CommentFormProps) => {
    const [commentText, setCommentText] = useState(initialText);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onSubmit(commentText);
            if (!isEditing) {
                setCommentText('');
            }
        }
    };

    return (
        <div className="comment-form">
            <h4 className="comment-form-title">
                {isEditing ? 'Edit Comment' : 'Add a Comment'}
            </h4>
            <form onSubmit={handleSubmit}>
                <div className="comment-input-container">
                    <textarea
                        className="comment-textarea"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Type your comment here..."
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="error-message">{error}</div>
                )}

                <div className="comment-actions">
                    {onCancel && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !commentText.trim()}
                    >
                        {loading ? 'Submitting...' : isEditing ? 'Update' : 'Add Comment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;