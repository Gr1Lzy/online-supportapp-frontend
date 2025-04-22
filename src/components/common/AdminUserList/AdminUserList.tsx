import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UserRole, AdminUserResponseDto } from '../../../types';
import { AppDispatch } from '../../../store';
import { deleteUser, assignRole } from '../../../store/slices/adminSlice';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import './AdminUserList.css';

interface AdminUserListProps {
    users: AdminUserResponseDto[];
    error: string | null;
}

const AdminUserList = ({ users, error }: AdminUserListProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: string,
        username: string,
        currentRoles: string[]
    } | null>(null);
    const [assignRoleError, setAssignRoleError] = useState<string | null>(null);

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await dispatch(deleteUser(userToDelete)).unwrap();
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    };

    const handleDeleteUser = (userId: string) => {
        setUserToDelete(userId);
        setShowDeleteConfirm(true);
    };

    const handleAssignRole = async (roleToAdd: UserRole) => {
        if (selectedUser) {
            try {
                setAssignRoleError(null);
                await dispatch(assignRole({
                    userId: selectedUser.id,
                    role: { role: roleToAdd }
                })).unwrap();

                setSelectedUser({
                    ...selectedUser,
                    currentRoles: [...selectedUser.currentRoles, roleToAdd]
                });

            } catch (error: any) {
                console.error("Failed to assign role:", error);
                setAssignRoleError(error?.message || "Failed to assign role. Please try again.");
            }
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === UserRole.ADMIN) {
            return <span className="role-badge role-admin">ADMIN</span>;
        } else if (role === UserRole.SUPPORT) {
            return <span className="role-badge role-support">SUPPORT</span>;
        } else {
            return <span className="role-badge role-user">USER</span>;
        }
    };

    const userHasRole = (user: string[], role: string) => {
        return user.includes(role);
    };

    return (
        <div className="user-management-section">
            <div className="user-management-header">
                <h2 className="user-management-title">Users</h2>
            </div>

            {error && (
                <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <table className="user-table">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Roles</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td className="roles-cell">
                            {user.roles?.length ? (
                                <div className="roles-container">
                                    {user.roles.map(role => (
                                        <div key={role}>
                                            {getRoleBadge(role)}
                                        </div>
                                    ))}
                                </div>
                            ) : 'No roles'}
                        </td>
                        <td>
                            <div className="user-actions">
                                <button
                                    className="action-button edit"
                                    onClick={() => {
                                        setSelectedUser({
                                            id: user.id,
                                            username: user.username,
                                            currentRoles: user.roles || []
                                        });
                                        setShowAssignRoleModal(true);
                                        setAssignRoleError(null);
                                    }}
                                >
                                    Manage Roles
                                </button>
                                <button
                                    className="action-button delete"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                title="Delete User"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
            >
                <p>Are you sure you want to delete this user?</p>
                <p>This action cannot be undone and will remove all user data from the system.</p>
            </ConfirmationDialog>

            {showAssignRoleModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Manage Roles for {selectedUser.username}</h3>
                            <button
                                className="close-button"
                                onClick={() => setShowAssignRoleModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Select a role to assign to this user. Roles already assigned are marked with a checkmark.</p>

                            {assignRoleError && (
                                <div className="error-message">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {assignRoleError}
                                </div>
                            )}

                            <div className="role-options">
                                {Object.values(UserRole).map(role => {
                                    const hasRole = userHasRole(selectedUser.currentRoles, role);
                                    const roleStyle =
                                        role === UserRole.USER ? 'role-user-button' :
                                            role === UserRole.SUPPORT ? 'role-support-button' :
                                                'role-admin-button';

                                    return (
                                        <button
                                            key={role}
                                            className={`role-button ${roleStyle} ${hasRole ? 'active' : ''}`}
                                            onClick={() => !hasRole && handleAssignRole(role)}
                                            disabled={hasRole}
                                            title={hasRole ? `User already has ${role.replace('ROLE_', '')} role` : `Assign ${role.replace('ROLE_', '')} role`}
                                        >
                                            {role.replace('ROLE_', '')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserList;