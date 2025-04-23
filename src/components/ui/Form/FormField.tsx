import React, { ReactNode } from 'react';
import './Form.css';

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 id,
                                                 label,
                                                 error,
                                                 helperText,
                                                 required = false,
                                                 children,
                                                 className = '',
                                             }) => {
    return (
        <div className={`form-field ${className} ${error ? 'form-field-error' : ''}`}>
            <label htmlFor={id} className="form-label">
                {label}
                {required && <span className="form-required">*</span>}
            </label>

            {children}

            {helperText && !error && (
                <div className="form-helper-text">{helperText}</div>
            )}

            {error && (
                <div className="form-error-message">{error}</div>
            )}
        </div>
    );
};

export default FormField;