import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LocationList from './pages/LocationList';
import LocationMap from './pages/LocationMap';
import LocationSearch from './pages/LocationSearch';
import LocationDetails from './pages/LocationDetails';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminLocations from './pages/AdminLocations';
import AdminUsers from './pages/AdminUsers';
import AdminHome from './pages/AdminHome';

function App() {
    return (
        <Router>
            <Routes>
                {/* 非用戶訪問路由 */}
                <Route path="/login" element={<LoginPage />} />

                {/* 用戶訪問路由 */}
                <Route path="/locations" element={<LocationList />} />
                <Route path="/locations/map" element={<LocationMap />} />
                <Route path="/locations/search" element={<LocationSearch />} />
                <Route path="/locations/:id" element={<LocationDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />

                {/* 管理員訪問路由 */}
                <Route path="/admin/locations" element={<AdminLocations />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin" element={<AdminHome />} />

                {/* 默認路由 */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
