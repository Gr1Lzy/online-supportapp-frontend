import React, { ReactNode } from 'react';
import './PageHeader.css';

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    icon?: ReactNode;
    bordered?: boolean;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
                                                   title,
                                                   subtitle,
                                                   actions,
                                                   icon,
                                                   bordered = true,
                                                   className = '',
                                               }) => {
    const classes = [
        'page-header',
        bordered ? 'page-header-bordered' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <header className={classes}>
            <div className="page-header-content">
                {icon && <div className="page-header-icon">{icon}</div>}
                <div className="page-header-titles">
                    <h1 className="page-header-title">{title}</h1>
                    {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
                </div>
            </div>

            {actions && (
                <div className="page-header-actions">
                    {actions}
                </div>
            )}
        </header>
    );
};

export default PageHeader;