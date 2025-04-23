import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Form.css';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    hasError?: boolean;
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    inputClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            hasError = false,
            size = 'md',
            leftIcon,
            rightIcon,
            disabled,
            className = '',
            inputClassName = '',
            ...props
        },
        ref
    ) => {
        const containerClasses = [
            'input-container',
            `input-${size}`,
            hasError ? 'input-error' : '',
            disabled ? 'input-disabled' : '',
            className
        ]
            .filter(Boolean)
            .join(' ');

        const inputClasses = [
            'input',
            leftIcon ? 'input-with-left-icon' : '',
            rightIcon ? 'input-with-right-icon' : '',
            inputClassName
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClasses}>
                {leftIcon && (
                    <div className="input-icon input-icon-left">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    className={inputClasses}
                    disabled={disabled}
                    {...props}
                />

                {rightIcon && (
                    <div className="input-icon input-icon-right">
                        {rightIcon}
                    </div>
                )}
            </div>
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;