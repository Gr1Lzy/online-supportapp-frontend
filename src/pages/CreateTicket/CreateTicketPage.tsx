import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTicket } from '../../redux/slices/ticketSlice.ts';
import { AppDispatch, RootState } from '../../redux/store.ts';
import './CreateTicketPage.css';
import {TicketRequestDto} from "../../types";

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
    description: Yup.string().required('Description is required')
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

    const formik = useFormik<TicketRequestDto>({
        initialValues: {
            title: '',
            description: '',
            assignee_id: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const ticketData: TicketRequestDto = {
                    title: values.title,
                    description: values.description,
                };

                if (values.assignee_id && values.assignee_id.trim()) {
                    ticketData.assignee_id = values.assignee_id.trim();
                }

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

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div className="create-ticket-container">
            <header className="create-ticket-header">
                <h1 className="header-title">Create Support Ticket</h1>
                <div className="header-actions">
                    <button className="back-button" onClick={handleCancel}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="create-ticket-card">
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

                <form onSubmit={formik.handleSubmit} className="form">
                    <div className="input-group">
                        <label htmlFor="title">Ticket Title *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            placeholder="Enter a title for your ticket"
                        />
                        <div className="input-description">
                            Brief summary of the issue (required)
                        </div>
                        {formik.touched.title && formik.errors.title ? (
                            <div className="form-error">{formik.errors.title}</div>
                        ) : null}
                    </div>

                    <div className="input-group">
                        <label htmlFor="description">Detailed Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            placeholder="Describe your issue in detail"
                        />
                        <div className="input-description">
                            Include all relevant details about the issue (required)
                        </div>
                        {formik.touched.description && formik.errors.description ? (
                            <div className="form-error">{formik.errors.description}</div>
                        ) : null}
                    </div>

                    <div className="input-group">
                        <label htmlFor="assignee_id">Assignee ID (Optional)</label>
                        <input
                            id="assignee_id"
                            name="assignee_id"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.assignee_id}
                            placeholder="Leave empty to auto-assign"
                        />
                        <div className="input-description">
                            Optional: You can leave this field empty to let the system assign a support agent automatically
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="submit-button">
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Creating Ticket...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Create Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketPage;