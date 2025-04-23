import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UserRole, AdminUserResponseDto } from '../../../types';
import { AppDispatch } from '../../../store';
import { deleteUser, assignRole } from '../../../store/slices/adminSlice';

import Button from '../../ui/Button/Button';
import Badge from '../../ui/Badge/Badge';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import Modal from '../../ui/Modal/Modal';
import Alert from '../../ui/Alert/Alert';

import './AdminUserList.css';

interface AdminUserListProps {
    users: AdminUserResponseDto[];
    error: string | null;
}

const AdminUserList: React.FC<AdminUserListProps> = ({
                                                         users,
                                                         error
                                                     }) => {
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
            return <Badge variant="danger" size="sm" pill>{role.replace('ROLE_', '')}</Badge>;
        } else if (role === UserRole.SUPPORT) {
            return <Badge variant="info" size="sm" pill>{role.replace('ROLE_', '')}</Badge>;
        } else {
            return <Badge variant="neutral" size="sm" pill>{role.replace('ROLE_', '')}</Badge>;
        }
    };

    const userHasRole = (userRoles: string[], role: string) => {
        return userRoles.includes(role);
    };

    return (
        <div className="admin-user-list">
            <h3 className="admin-user-list-title">User Management</h3>

            {error && (
                <Alert
                    variant="danger"
                    title="Error"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            <div className="table-container">
                <table className="admin-user-table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.first_name && user.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : '-'}
                                </td>
                                <td className="roles-cell">
                                    <div className="roles-container">
                                        {user.roles?.length ? (
                                            user.roles.map(role => (
                                                <div key={role}>
                                                    {getRoleBadge(role)}
                                                </div>
                                            ))
                                        ) : 'No roles'}
                                    </div>
                                </td>
                                <td>
                                    <div className="user-actions">
                                        <Button
                                            variant="primary"
                                            size="sm"
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
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="empty-table-message">
                                No users found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Delete confirmation dialog */}
            <ConfirmationDialog
                isOpen={showDeleteConfirm}
                title="Delete User"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                isDestructive={true}
            >
                <p>Are you sure you want to delete this user?</p>
                <p>This action cannot be undone and will remove all user data from the system.</p>
            </ConfirmationDialog>

            {/* Assign role modal */}
            {showAssignRoleModal && selectedUser && (
                <Modal
                    isOpen={showAssignRoleModal}
                    title={`Manage Roles for ${selectedUser.username}`}
                    onClose={() => setShowAssignRoleModal(false)}
                    size="sm"
                >
                    <div className="role-modal-content">
                        <p>Select a role to assign to this user. Roles already assigned are marked with a checkmark.</p>

                        {assignRoleError && (
                            <Alert
                                variant="danger"
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                className="mb-4"
                            >
                                {assignRoleError}
                            </Alert>
                        )}

                        <div className="role-options">
                            {Object.values(UserRole).map(role => {
                                const hasRole = userHasRole(selectedUser.currentRoles, role);
                                return (
                                    <Button
                                        key={role}
                                        variant={
                                            role === UserRole.ADMIN
                                                ? 'danger'
                                                : role === UserRole.SUPPORT
                                                    ? 'primary'
                                                    : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => !hasRole && handleAssignRole(role)}
                                        disabled={hasRole}
                                        className="role-button"
                                    >
                                        {role.replace('ROLE_', '')}
                                        {hasRole}
                                    </Button>
                                );
                            })}
                        </div>

                        <div className="modal-actions">
                            <Button
                                variant="outline"
                                onClick={() => setShowAssignRoleModal(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AdminUserList;