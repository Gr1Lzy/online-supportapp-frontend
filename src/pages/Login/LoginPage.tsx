import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';
import './LoginPage.css';

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    if (isAuthenticated) {
        navigate('/dashboard');
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await dispatch(login(values)).unwrap();
                navigate('/dashboard');
            } catch (err) {
                // Error handled in the slice
            }
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            </div>

            <h1 className="login-title">Welcome to Support App</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="login-form">
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        placeholder="Enter your username"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div className="error">{formik.errors.username}</div>
                    ) : null}
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="toggle-password-button"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                        <div className="error">{formik.errors.password}</div>
                    ) : null}
                </div>

                <button type="submit" disabled={loading} className="login-button">
                    {loading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Signing in...
                        </>
                    ) : 'Sign In'}
                </button>
            </form>

            <div className="signup-link">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
        </div>
    );
};

export default LoginPage;