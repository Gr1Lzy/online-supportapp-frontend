import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/layout/Container/Container';
import Button from '../../components/ui/Button/Button';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
    return (
        <Container size="md">
            <div className="not-found-container">
                <div className="not-found-image">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                </div>

                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Not Found</h2>

                <p className="not-found-message">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link to="/" className="home-link">
                    <Button>
                        Back to Home
                    </Button>
                </Link>
            </div>
        </Container>
    );
};

export default NotFoundPage;