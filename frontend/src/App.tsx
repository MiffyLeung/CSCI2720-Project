// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import WhatsNewPage from './pages/WhatsNewPage';
import HotestPage from './pages/HottestPage';
import MapViewPage from './pages/MapViewPage';
import MyFavoritesPage from './pages/MyFavoritesPage';
import MyProfilePage from './pages/MyProfilePage';
import VenueListPage from './pages/VenueListPage';
import ProgrammeDetailsPage from './pages/ProgrammeDetailsPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import AdminProgrammesPage from './pages/AdminProgrammesPage';
import AdminAccountsPage from './pages/AdminAccountsPage';
import AdminVenuesPage from './pages/AdminVenuesPage';
import { useAuth } from './core/AuthContext';

const App: React.FC = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    const requireAuth = (element: React.ReactElement) =>
        isAuthenticated ? element : <Navigate to="/login" />;

    const requireAdmin = (element: React.ReactElement) =>
        isAuthenticated && isAdmin ? element : <Navigate to="/" />;

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={isAuthenticated ? <VenueListPage /> : <Navigate to="/login" />} />
            <Route path="/recent" element={requireAuth(<WhatsNewPage />)} />
            <Route path="/hotest" element={requireAuth(<HotestPage />)} />
            <Route path="/map" element={requireAuth(<MapViewPage />)} />
            <Route path="/myFavorites" element={requireAuth(<MyFavoritesPage />)} />
            <Route path="/myProfile" element={requireAuth(<MyProfilePage />)} />
            <Route path="/programme/:id" element={requireAuth(<ProgrammeDetailsPage />)} />
            <Route path="/venue/:id" element={requireAuth(<VenueDetailsPage />)} />

            {/* User-Specific Routes */}
            <Route path="/dashboard" element={requireAuth(<VenueListPage />)} />

            {/* Admin-Specific Routes */}
            <Route path="/admin/" element={requireAdmin(<AdminProgrammesPage />)} />
            <Route path="/admin/programmes" element={requireAdmin(<AdminProgrammesPage />)} />
            <Route path="/admin/accounts" element={requireAdmin(<AdminAccountsPage />)} />
            <Route path="/admin/venues" element={requireAdmin(<AdminVenuesPage />)} />

            {/* Catch-All for Undefined Routes */}
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
};

export default App;
