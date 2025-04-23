import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';

import Container from '../../components/layout/Container/Container';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import FormField from '../../components/ui/Form/FormField';
import TextInput from '../../components/ui/Form/TextInput';
import Alert from '../../components/ui/Alert/Alert';

import './LoginPage.css';

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required'),
    password: Yup.string()
        .required('Password is required'),
});

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

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
        <div className="login-page">
            <Container size="sm">
                <Card className="login-card">
                    <div className="login-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="64" height="64">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>

                    <h1 className="login-title">Welcome to Support App</h1>
                    <p className="login-subtitle">Sign in to your account to continue</p>

                    {error && (
                        <Alert
                            variant="danger"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            className="login-error"
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={formik.handleSubmit} className="login-form">
                        <FormField
                            id="username"
                            label="Username"
                            error={formik.touched.username && formik.errors.username ? formik.errors.username : undefined}
                        >
                            <TextInput
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                hasError={!!(formik.touched.username && formik.errors.username)}
                            />
                        </FormField>

                        <FormField
                            id="password"
                            label="Password"
                            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                        >
                            <TextInput
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                hasError={!!(formik.touched.password && formik.errors.password)}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="password-toggle"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                }
                            />
                        </FormField>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            isLoading={loading}
                            fullWidth
                            className="login-button"
                        >
                            Sign In
                        </Button>
                    </form>
                </Card>
            </Container>
        </div>
    );
};

export default LoginPage;