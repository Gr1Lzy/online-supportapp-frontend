import React, { ReactNode } from 'react';
import Modal from '../../ui/Modal/Modal';
import Button from '../../ui/Button/Button';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmVariant?: 'primary' | 'danger';
    isDestructive?: boolean;
    isConfirming?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                   isOpen,
                                                                   title,
                                                                   children,
                                                                   onConfirm,
                                                                   onCancel,
                                                                   confirmButtonText = 'Confirm',
                                                                   cancelButtonText = 'Cancel',
                                                                   confirmVariant = 'primary',
                                                                   isDestructive = false,
                                                                   isConfirming = false,
                                                               }) => {
    const buttonVariant = isDestructive ? 'danger' : confirmVariant;

    const footer = (
        <>
            <Button
                variant="outline"
                onClick={onCancel}
                disabled={isConfirming}
            >
                {cancelButtonText}
            </Button>
            <Button
                variant={buttonVariant}
                onClick={onConfirm}
                isLoading={isConfirming}
                disabled={isConfirming}
            >
                {confirmButtonText}
            </Button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onCancel}
            footer={footer}
            size="sm"
        >
            {children}
        </Modal>
    );
};

export default ConfirmationDialog;