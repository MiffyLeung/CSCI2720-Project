import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LocationList from './pages/LocationList';
import LocationDetail from './pages/LocationDetail';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LocationList />} />
                <Route path="/locations/:id" element={<LocationDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
