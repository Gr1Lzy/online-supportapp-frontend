import React, { ReactNode } from 'react';
import './Tabs.css';

export interface TabProps {
    id: string;
    label: string;
    isActive?: boolean;
    icon?: ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

const Tab: React.FC<TabProps> = ({
                                     id,
                                     label,
                                     isActive = false,
                                     icon,
                                     onClick,
                                     className = '',
                                     disabled = false,
                                 }) => {
    const classes = [
        'tab',
        isActive ? 'tab-active' : '',
        disabled ? 'tab-disabled' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            id={`tab-${id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${id}`}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <span className="tab-icon">{icon}</span>}
            <span className="tab-label">{label}</span>
        </button>
    );
};

export default Tab;