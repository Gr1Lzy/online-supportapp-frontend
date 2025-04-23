import { TextareaHTMLAttributes, forwardRef } from 'react';
import './Form.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
    textareaClassName?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            hasError = false,
            disabled,
            className = '',
            textareaClassName = '',
            ...props
        },
        ref
    ) => {
        const textareaClasses = [
            'textarea',
            hasError ? 'textarea-error' : '',
            disabled ? 'textarea-disabled' : '',
            textareaClassName
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={className}>
        <textarea
            ref={ref}
            className={textareaClasses}
            disabled={disabled}
            {...props}
        />
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;