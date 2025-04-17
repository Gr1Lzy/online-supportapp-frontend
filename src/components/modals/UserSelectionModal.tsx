import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../store/slices/supportSlice';
import { AppDispatch, RootState } from '../../store';
import './Modals.css';

interface UserSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserSelect: (userId: string) => void;
    currentAssigneeId?: string;
    title?: string;
}

const UserSelectionModal = ({
                                isOpen,
                                onClose,
                                onUserSelect,
                                currentAssigneeId,
                                title = 'Assign To User'
                            }: UserSelectionModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loadingUsers } = useSelector((state: RootState) => state.support);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchUsers());
        }
    }, [dispatch, isOpen]);

    if (!isOpen) return null;

    const filteredUsers = users.filter(user => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(searchTermLower) ||
            user.email.toLowerCase().includes(searchTermLower) ||
            (user.first_name && user.first_name.toLowerCase().includes(searchTermLower)) ||
            (user.last_name && user.last_name.toLowerCase().includes(searchTermLower))
        );
    });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {loadingUsers ? (
                        <div className="modal-loading">
                            <div className="spinner"></div>
                            <p>Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="no-results">
                            <p>No users found matching your search</p>
                        </div>
                    ) : (
                        <div className="user-list">
                            {filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={`user-item ${user.id === currentAssigneeId ? 'selected' : ''}`}
                                    onClick={() => onUserSelect(user.id)}
                                >
                                    <div className="user-avatar">
                                        {user.first_name && user.last_name
                                            ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
                                            : user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">
                                            {user.first_name && user.last_name
                                                ? `${user.first_name} ${user.last_name}`
                                                : user.username}
                                        </div>
                                        <div className="user-email">{user.email}</div>
                                    </div>
                                    {user.id === currentAssigneeId && (
                                        <div className="current-assignee-badge">
                                            Current
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSelectionModal;