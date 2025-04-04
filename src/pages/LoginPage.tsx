import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';

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

    const styles = {
        container: {
            maxWidth: '400px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        title: {
            textAlign: 'center' as const,
            marginBottom: '20px',
            color: '#333',
        },
        form: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '15px',
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '5px',
        },
        label: {
            fontWeight: 'bold',
            color: '#444',
        },
        input: {
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '16px',
        },
        error: {
            color: 'red',
            fontSize: '14px',
            marginTop: '5px',
        },
        button: {
            padding: '12px',
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px',
        },
        link: {
            textAlign: 'center' as const,
            marginTop: '15px',
            color: '#646cff',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Support App Login</h1>

            {error && <div style={{ ...styles.error, marginBottom: '15px' }}>{error}</div>}

            <form onSubmit={formik.handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="username" style={styles.label}>Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        style={styles.input}
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div style={styles.error}>{formik.errors.username}</div>
                    ) : null}
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            style={styles.input}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                        <div style={styles.error}>{formik.errors.password}</div>
                    ) : null}
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div style={styles.link}>
                Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
        </div>
    );
};

export default LoginPage;