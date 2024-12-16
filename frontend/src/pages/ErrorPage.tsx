// src/pages/ErrorPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
            <h1 className="display-3 text-danger mb-4">404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="mb-4">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/" className="btn btn-success">
                Go to Homepage
            </Link>
        </div>
    );
};

export default ErrorPage;
