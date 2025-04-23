import React, {HTMLAttributes, ReactNode} from 'react';
import './Badge.css';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    pill?: boolean;
    outline?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
                                                children,
                                                variant = 'primary',
                                                size = 'md',
                                                pill = false,
                                                outline = false,
                                                className = '',
                                                ...props
                                            }) => {
    const classes = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        pill ? 'badge-pill' : '',
        outline ? 'badge-outline' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={classes} {...props}>
      {children}
    </span>
    );
};

export default Badge;