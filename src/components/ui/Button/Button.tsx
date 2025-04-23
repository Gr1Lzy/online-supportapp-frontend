import { ButtonHTMLAttributes, forwardRef, ReactNode, ElementType } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'success' | 'warning' | 'info';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    as?: ElementType;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            isLoading = false,
            disabled,
            className = '',
            as: Component = 'button',
            ...props
        },
        ref
    ) => {
        const classes = [
            'button',
            `button-${variant}`,
            `button-${size}`,
            fullWidth ? 'button-full-width' : '',
            isLoading ? 'button-loading' : '',
            className
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <Component
                ref={ref}
                className={classes}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <span className="button-spinner" />}
                <span className="button-text">{children}</span>
            </Component>
        );
    }
);

Button.displayName = 'Button';

export default Button;