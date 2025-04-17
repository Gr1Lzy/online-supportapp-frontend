import { useState } from 'react';
import { TicketStatus } from '../../types';
import { formatTicketStatus } from '../../utils/formatters';
import './Modals.css';

interface StatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (status: TicketStatus) => void;
    currentStatus: TicketStatus;
}

const StatusChangeModal = ({
                               isOpen,
                               onClose,
                               onStatusChange,
                               currentStatus
                           }: StatusChangeModalProps) => {
    const [selectedStatus, setSelectedStatus] = useState<TicketStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleStatusSelect = (status: TicketStatus) => {
        // Prevent selecting the current status
        if (status !== currentStatus) {
            setSelectedStatus(status === selectedStatus ? null : status);
            setError(null);
        }
    };

    const handleConfirm = () => {
        // Validate status selection
        if (!selectedStatus) {
            setError('Please select a new status');
            return;
        }

        // Prevent updating to the same status
        if (selectedStatus === currentStatus) {
            setError('Select a different status');
            return;
        }

        // Clear any previous errors
        setError(null);

        // Call the status change handler
        onStatusChange(selectedStatus);

        // Reset state
        setSelectedStatus(null);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container status-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Change Ticket Status</h3>
                    <button className="close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <p className="status-info">
                        Current Status: <span className={`status-badge status-${currentStatus.toLowerCase()}`}>
                            {formatTicketStatus(currentStatus)}
                        </span>
                    </p>

                    {error && (
                        <div className="error-message" style={{ marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <div className="status-options">
                        {Object.values(TicketStatus).map(status => (
                            <div
                                key={status}
                                className={`status-option 
                                    ${status === currentStatus ? 'current' : ''} 
                                    ${status === selectedStatus ? 'selected' : ''}
                                `}
                                onClick={() => handleStatusSelect(status)}
                            >
                                <div className={`status-indicator status-${status.toLowerCase()}`}></div>
                                <div className="status-label">{formatTicketStatus(status)}</div>
                                {status === currentStatus && (
                                    <div className="current-status-marker">(Current)</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="confirm-button"
                        onClick={handleConfirm}
                        disabled={!selectedStatus || selectedStatus === currentStatus}
                    >
                        Update Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusChangeModal;