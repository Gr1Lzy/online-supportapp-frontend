import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTicket } from '../../store/slices/ticketSlice';
import { AppDispatch, RootState } from '../../store';
import { TicketRequestDto } from '../../types';

import Container from '../../components/layout/Container/Container';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Card from '../../components/ui/Card/Card';
import Button from '../../components/ui/Button/Button';
import FormField from '../../components/ui/Form/FormField';
import TextInput from '../../components/ui/Form/TextInput';
import TextArea from '../../components/ui/Form/TextArea';
import Alert from '../../components/ui/Alert/Alert';

import './CreateTicketPage.css';

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title must be less than 100 characters'),
    description: Yup.string()
        .required('Description is required')
});

const CreateTicketPage: React.FC = () => {
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
        <Container size="md">
            <PageHeader
                title="Create Support Ticket"
                actions={
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Back to Dashboard
                    </Button>
                }
            />

            <Card className="create-ticket-card">
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
                    >
                        {successMessage}
                    </Alert>
                )}

                {error && (
                    <Alert
                        variant="danger"
                        title="Error"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        className="mb-4"
                    >
                        {error}
                    </Alert>
                )}

                <form onSubmit={formik.handleSubmit} className="create-ticket-form">
                    <FormField
                        id="title"
                        label="Ticket Title"
                        required
                        error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
                        helperText="Brief summary of the issue"
                    >
                        <TextInput
                            id="title"
                            name="title"
                            placeholder="Enter a title for your ticket"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            hasError={!!(formik.touched.title && formik.errors.title)}
                        />
                    </FormField>

                    <FormField
                        id="description"
                        label="Detailed Description"
                        required
                        error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
                        helperText="Include all relevant details about the issue"
                    >
                        <TextArea
                            id="description"
                            name="description"
                            placeholder="Describe your issue in detail"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            hasError={!!(formik.touched.description && formik.errors.description)}
                        />
                    </FormField>

                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            isLoading={loading}
                        >
                            Create Ticket
                        </Button>
                    </div>
                </form>
            </Card>
        </Container>
    );
};

export default CreateTicketPage;