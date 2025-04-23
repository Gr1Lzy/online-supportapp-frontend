import React, { ReactNode } from 'react';
import './Tabs.css';

export interface TabsProps {
    children: ReactNode;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({
                                       children,
                                       className = ''
                                   }) => {
    const classes = [
        'tabs',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            <nav className="tabs-nav">
                <div className="tabs-list">
                    {children}
                </div>
            </nav>
        </div>
    );
};

export default Tabs;