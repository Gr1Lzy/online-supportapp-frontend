import React, { ReactNode, useEffect, useRef } from 'react';
import './Modal.css';

export interface ModalProps {
    isOpen: boolean;
    title?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    onClose: () => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnClickOutside?: boolean;
    closeOnEsc?: boolean;
    zIndex?: number;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                title,
                                                children,
                                                footer,
                                                onClose,
                                                size = 'md',
                                                closeOnClickOutside = true,
                                                closeOnEsc = true,
                                                zIndex = 1050,
                                            }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (closeOnEsc && event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, closeOnEsc, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnClickOutside && e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalClasses = ['modal-container', `modal-${size}`].join(' ');

    return (
        <div
            className="modal-overlay"
            onClick={handleBackdropClick}
            style={{ zIndex }}
        >
            <div
                className={modalClasses}
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button
                            className="modal-close-button"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="modal-body">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;