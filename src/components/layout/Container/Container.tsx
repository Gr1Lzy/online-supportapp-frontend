import React, { ReactNode } from 'react';
import './Container.css';

interface ContainerProps {
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    centered?: boolean;
    padding?: boolean;
    className?: string;
}

const Container: React.FC<ContainerProps> = ({
                                                 children,
                                                 size = 'lg',
                                                 centered = true,
                                                 padding = true,
                                                 className = '',
                                             }) => {
    const classes = [
        'layout-container',
        `container-${size}`,
        centered ? 'container-centered' : '',
        padding ? 'container-padding' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {children}
        </div>
    );
};

export default Container;