import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';


import './UserRegistrationForm.css';
import { AppDispatch, RootState } from '../../../store';
import {UserCreateRequestDto} from "../../../types";
import { registerUser } from '../../../store/slices/adminSlice';
import Card from "../../ui/Card/Card.tsx";
import Alert from "../../ui/Alert/Alert.tsx";
import FormField from "../../ui/Form/FormField.tsx";
import TextInput from "../../ui/Form/TextInput.tsx";
import Button from "../../ui/Button/Button.tsx";

interface UserRegistrationFormProps {
    onSuccess?: () => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onSuccess }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.admin);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        return () => setSuccessMessage(null);
    }, [error]);

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .min(3, 'Username must be at least 3 characters')
            .max(50, 'Username must be less than 50 characters')
            .matches(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, and _.-'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required')
            .max(100, 'Email must be less than 100 characters'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        first_name: Yup.string()
            .max(50, 'First name must be less than 50 characters'),
        last_name: Yup.string()
            .max(50, 'Last name must be less than 50 characters'),
    });

    const formik = useFormik<UserCreateRequestDto>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            first_name: '',
            last_name: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                setSuccessMessage(null);
                await dispatch(registerUser(values)).unwrap();
                setSuccessMessage('User registered successfully');
                resetForm();

                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                console.error('Registration failed:', err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const { dirty, isValid, handleSubmit, getFieldProps, touched, errors } = formik;

    return (
        <Card className="registration-form-card">
            <h2 className="registration-form-title">Register New User</h2>

            {successMessage && (
                <Alert
                    variant="success"
                    title="Success"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    }
                    className="mb-4"
                    dismissible
                    onDismiss={() => setSuccessMessage(null)}
                >
                    {successMessage}
                </Alert>
            )}


            <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-grid-2-col">
                    <FormField
                        id="username"
                        label="Username"
                        required
                        error={touched.username && errors.username ? errors.username : undefined}
                    >
                        <TextInput
                            id="username"
                            placeholder="Enter username"
                            hasError={!!(touched.username && errors.username)}
                            {...getFieldProps('username')}
                        />
                    </FormField>

                    <FormField
                        id="email"
                        label="Email"
                        required
                        error={touched.email && errors.email ? errors.email : undefined}
                    >
                        <TextInput
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            hasError={!!(touched.email && errors.email)}
                            {...getFieldProps('email')}
                        />
                    </FormField>
                </div>

                <FormField
                    id="password"
                    label="Password"
                    required
                    error={touched.password && errors.password ? errors.password : undefined}
                    helperText="Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number"
                >
                    <TextInput
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        hasError={!!(touched.password && errors.password)}
                        {...getFieldProps('password')}
                    />
                </FormField>

                <div className="form-grid-2-col">
                    <FormField
                        id="first_name"
                        label="First Name"
                        error={touched.first_name && errors.first_name ? errors.first_name : undefined}
                    >
                        <TextInput
                            id="first_name"
                            placeholder="Enter first name"
                            hasError={!!(touched.first_name && errors.first_name)}
                            {...getFieldProps('first_name')}
                        />
                    </FormField>

                    <FormField
                        id="last_name"
                        label="Last Name"
                        error={touched.last_name && errors.last_name ? errors.last_name : undefined}
                    >
                        <TextInput
                            id="last_name"
                            placeholder="Enter last name"
                            hasError={!!(touched.last_name && errors.last_name)}
                            {...getFieldProps('last_name')}
                        />
                    </FormField>
                </div>

                <div className="form-actions">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || !(dirty && isValid)}
                        isLoading={loading}
                    >
                        Register User
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default UserRegistrationForm;