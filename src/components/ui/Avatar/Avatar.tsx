import React from 'react';
import './Avatar.css';

export interface AvatarProps {
    name?: string;
    src?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    shape?: 'circle' | 'square';
    bgColor?: string;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
                                                  name,
                                                  src,
                                                  size = 'md',
                                                  shape = 'circle',
                                                  bgColor,
                                                  className = '',
                                              }) => {
    const classes = [
        'avatar',
        `avatar-${size}`,
        `avatar-${shape}`,
        className
    ]
        .filter(Boolean)
        .join(' ');

    const getInitials = (name: string): string => {
        if (!name) return '';

        const nameParts = name.split(' ').filter(Boolean);

        if (nameParts.length === 1) {
            return nameParts[0].charAt(0).toUpperCase();
        }

        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    };

    const getColorFromName = (name: string): string => {
        if (!name) return '#3498db';

        const colors = [
            '#3498db',
            '#2ecc71',
            '#e74c3c',
            '#f39c12',
            '#9b59b6',
            '#1abc9c',
            '#d35400',
            '#2980b9',
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const avatarColor = bgColor || (name ? getColorFromName(name) : '#3498db');
    const initials = name ? getInitials(name) : '';

    return (
        <div
            className={classes}
            style={{ backgroundColor: !src ? avatarColor : undefined }}
            title={name}
        >
            {src ? (
                <img
                    src={src}
                    alt={name || 'Avatar'}
                    className="avatar-image"
                />
            ) : (
                <span className="avatar-initials">
          {initials}
        </span>
            )}
        </div>
    );
};

export default Avatar;