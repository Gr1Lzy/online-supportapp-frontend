import React, { ReactNode, useEffect, useState } from 'react';
import './Alert.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
export type AriaLive = 'assertive' | 'polite' | 'off';

export interface AlertProps {
    children: ReactNode;
    variant?: AlertVariant;
    title?: string;
    icon?: ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    autoDismiss?: number | null;
    announceToScreenReader?: boolean;
    className?: string;
    id?: string;
}

export const Alert: React.FC<AlertProps> = ({
                                                children,
                                                variant = 'info',
                                                title,
                                                icon,
                                                dismissible = false,
                                                onDismiss,
                                                autoDismiss = null,
                                                announceToScreenReader = true,
                                                className = '',
                                                id,
                                            }) => {
    const [visible, setVisible] = useState(true);
    const [leaving, setLeaving] = useState(false);

    const alertId = id || `alert-${Math.random().toString(36).substring(2, 9)}`;

    useEffect(() => {
        if (autoDismiss && autoDismiss > 0) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, autoDismiss);

            return () => clearTimeout(timer);
        }
    }, [autoDismiss]);

    const handleDismiss = () => {
        setLeaving(true);

        setTimeout(() => {
            setVisible(false);
            if (onDismiss) {
                onDismiss();
            }
        }, 300);
    };

    if (!visible) {
        return null;
    }

    const classes = [
        'alert',
        `alert-${variant}`,
        leaving ? 'alert-leaving' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    let alertProps: React.HTMLAttributes<HTMLDivElement> = {
        id: alertId,
        className: classes
    };

    if (announceToScreenReader) {
        if (variant === 'danger' || variant === 'warning') {
            alertProps = {
                ...alertProps,
                role: 'alert',
                'aria-live': 'assertive' as AriaLive
            };
        } else {
            alertProps = {
                ...alertProps,
                role: 'status',
                'aria-live': 'polite' as AriaLive
            };
        }
    }

    return (
        <div {...alertProps}>
            {dismissible && onDismiss && (
                <button
                    className="alert-dismiss"
                    onClick={handleDismiss}
                    aria-label="Close alert"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {(icon || title) && (
                <div className="alert-header">
                    {icon && <div className="alert-icon">{icon}</div>}
                    {title && <div className="alert-title">{title}</div>}
                </div>
            )}

            <div className="alert-content">
                {children}
            </div>
        </div>
    );
};

export default Alert;