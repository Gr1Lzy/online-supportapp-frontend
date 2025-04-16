import {ReactNode} from 'react';
import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

const ConfirmationDialog = ({
                                isOpen,
                                title,
                                children,
                                onConfirm,
                                onCancel,
                                confirmButtonText = 'Confirm',
                                cancelButtonText = 'Cancel'
                            }: ConfirmationDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-overlay" onClick={onCancel}>
            <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="confirmation-header">
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onCancel}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="confirmation-body">
                    {children}
                </div>
                <div className="confirmation-actions">
                    <button className="cancel-button" onClick={onCancel}>
                        {cancelButtonText}
                    </button>
                    <button className="confirm-button" onClick={onConfirm}>
                        {confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;