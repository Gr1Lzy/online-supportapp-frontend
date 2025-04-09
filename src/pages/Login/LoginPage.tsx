import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
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
            <h1 className="login-title">Support App Login</h1>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="login-form">
                <div className="input-group">
                    <label htmlFor="username" className="label">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        className="input"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div className="error">{formik.errors.username}</div>
                    ) : null}
                </div>

                <div className="input-group">
                    <label htmlFor="password" className="label">Password</label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className="input"
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

                <button type="submit" disabled={loading} className="button">
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="signup-link">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
        </div>
    );
};

export default LoginPage;