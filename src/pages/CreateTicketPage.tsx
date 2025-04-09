import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTicket } from '../redux/slices/ticketSlice';
import { AppDispatch, RootState } from '../redux/store';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
});

const CreateTicketPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.tickets);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    if (!isAuthenticated) {
        navigate('/');
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            assignee_id: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const ticketData = {
                    ...values,
                };

                await dispatch(createTicket(ticketData)).unwrap();
                setSuccessMessage('Ticket created successfully!');
                formik.resetForm();
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } catch (err) {
                // Error handled in the slice
            }
        },
    });

    const styles = {
        container: {
            maxWidth: '800px',
            margin: '50px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        header: {
            marginBottom: '20px',
            color: '#333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
        textarea: {
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '16px',
            minHeight: '150px',
            resize: 'vertical' as const,
        },
        error: {
            color: 'red',
            fontSize: '14px',
            marginTop: '5px',
        },
        success: {
            color: 'green',
            fontSize: '16px',
            marginBottom: '15px',
            fontWeight: 'bold',
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
        buttonSecondary: {
            padding: '12px',
            backgroundColor: '#f3f3f3',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px',
        },
        navigation: {
            display: 'flex',
            gap: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>Create Support Ticket</h1>
                <div style={styles.navigation}>
                    <button style={styles.buttonSecondary} onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {successMessage && <div style={styles.success}>{successMessage}</div>}
            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={formik.handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="title" style={styles.label}>Ticket Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        style={styles.input}
                        placeholder="Enter a title for your ticket"
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div style={styles.error}>{formik.errors.title}</div>
                    ) : null}
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="description" style={styles.label}>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        style={styles.textarea}
                        placeholder="Describe your issue in detail"
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <div style={styles.error}>{formik.errors.description}</div>
                    ) : null}
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="assignee_id" style={styles.label}>Assignee ID (Optional)</label>
                    <input
                        id="assignee_id"
                        name="assignee_id"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.assignee_id}
                        style={styles.input}
                        placeholder="Leave empty to auto-assign"
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Creating Ticket...' : 'Create Ticket'}
                </button>
            </form>
        </div>
    );
};

export default CreateTicketPage;