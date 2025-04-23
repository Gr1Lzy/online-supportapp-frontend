import React from 'react';
import './Spinner.css';

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'secondary' | 'light' | 'dark';
    className?: string;
    ariaLabel?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
                                                    size = 'md',
                                                    variant = 'primary',
                                                    className = '',
                                                    ariaLabel = 'Loading'
                                                }) => {
    const classes = [
        'spinner',
        `spinner-${size}`,
        `spinner-${variant}`,
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            role="status"
            aria-label={ariaLabel}
        >
            <span className="sr-only">{ariaLabel}</span>
        </div>
    );
};

export default Spinner;