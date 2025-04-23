import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    interactive?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    bordered?: boolean;
    shadow?: boolean | 'sm' | 'md' | 'lg' | 'xl';
    elevation?: boolean | 'sm' | 'md' | 'lg';
    className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            children,
            header,
            footer,
            interactive = false,
            padding = 'md',
            bordered = true,
            shadow = true,
            elevation = false,
            className = '',
            ...props
        },
        ref
    ) => {
        const shadowClass = shadow ? 'card-shadow' : '';

        const elevationClass = elevation ? 'card-elevation' : '';

        const classes = [
            'card',
            interactive ? 'card-interactive' : '',
            bordered ? 'card-bordered' : '',
            shadowClass,
            elevationClass,
            padding !== 'none' ? `card-padding-${padding}` : '',
            className
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div
                ref={ref}
                className={classes}
                {...props}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
            >
                {header && <div className="card-header">{header}</div>}
                <div className="card-body">{children}</div>
                {footer && <div className="card-footer">{footer}</div>}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;