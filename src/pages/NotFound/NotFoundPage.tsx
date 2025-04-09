import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Page Not Found</h2>
            <p className="not-found-message">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="home-button">
                Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;