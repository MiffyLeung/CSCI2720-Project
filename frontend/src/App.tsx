// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import WhatsNewPage from './pages/WhatsNewPage';
import HotestPage from './pages/HotestPage';
import MapViewPage from './pages/MapViewPage';
import MyFavoritesPage from './pages/MyFavoritesPage';
import MyProfilePage from './pages/MyProfilePage';
import UserDashboardPage from './pages/UserDashboardPage';
import ProgrammeDetailsPage from './pages/ProgrammeDetailsPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import AdminProgrammesPage from './pages/AdminProgrammesPage';
import AdminAccountsPage from './pages/AdminAccountsPage';
import AdminVenuesPage from './pages/AdminVenuesPage';
import { useAuthState } from './utils/secure';

const App: React.FC = () => {
  const { isAdmin, isAuthenticated, authInitialized } = useAuthState();

  const requireAuth = (element: React.JSX.Element) => {
    return isAuthenticated ? element : null;
  };

  const requireAdmin = (element: React.JSX.Element) => {
    return isAdmin ? element : null;
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Common Routes */}
        <Route path="/recent" element={requireAuth(<WhatsNewPage />)} />
        <Route path="/hotest" element={requireAuth(<HotestPage />)} />
        <Route path="/map" element={requireAuth(<MapViewPage />)} />
        <Route path="/myFavorites" element={requireAuth(<MyFavoritesPage />)} />
        <Route path="/myProfile" element={requireAuth(<MyProfilePage />)} />
        <Route path="/programme/:id" element={requireAuth(<ProgrammeDetailsPage />)} />
        <Route path="/venue/:id" element={requireAuth(<VenueDetailsPage />)} />

        {/* User-Specific Routes */}
        <Route path="/dashboard" element={requireAuth(<UserDashboardPage />)} />

        {/* Admin-Specific Routes */}
        <Route path="/admin/" element={requireAdmin(<AdminProgrammesPage />)} />
        <Route path="/admin/programmes" element={requireAdmin(<AdminProgrammesPage />)} />
        <Route path="/admin/accounts" element={requireAdmin(<AdminAccountsPage />)} />
        <Route path="/admin/venues" element={requireAdmin(<AdminVenuesPage />)} />

        {/* Home page according to different account roles */}
        <Route path="/" element={!authInitialized ? null : isAuthenticated ? (isAdmin ? <AdminProgrammesPage /> : <UserDashboardPage />) : <Navigate to="/login" />} />

        {/* Catch-All for Undefined Routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
