import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../store/slices/adminSlice';
import { AppDispatch, RootState } from '../../store';
import { UserCreateRequestDto } from '../../types';
import './UserRegistrationForm.css';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    first_name: Yup.string().min(2, 'First name must be at least 2 characters'),
    last_name: Yup.string().min(2, 'Last name must be at least 2 characters'),
});

const UserRegistrationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.admin);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const formik = useFormik<UserCreateRequestDto>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            first_name: '',
            last_name: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setSuccessMessage(null);
                await dispatch(registerUser(values)).unwrap();
                setSuccessMessage('User registered successfully');
                resetForm();
                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                // Error handled in the slice
                console.error('Registration failed:', err);
            }
        },
    });

    return (
        <div className="user-registration-form-container">
            <h3 className="form-title">Register New User</h3>

            {successMessage && (
                <div className="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="registration-form">
                <div className="form-grid">
                    <div className="form-field">
                        <label htmlFor="username">Username *</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            placeholder="Enter username"
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div className="error">{formik.errors.username}</div>
                        ) : null}
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Email *</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            placeholder="Enter email address"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="error">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password *</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder="Enter password (min. 8 characters)"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="error">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <div className="form-field">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.first_name}
                            placeholder="Enter first name"
                        />
                        {formik.touched.first_name && formik.errors.first_name ? (
                            <div className="error">{formik.errors.first_name}</div>
                        ) : null}
                    </div>

                    <div className="form-field">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.last_name}
                            placeholder="Enter last name"
                        />
                        {formik.touched.last_name && formik.errors.last_name ? (
                            <div className="error">{formik.errors.last_name}</div>
                        ) : null}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || !formik.isValid}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Registering...
                            </>
                        ) : 'Register User'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserRegistrationForm;