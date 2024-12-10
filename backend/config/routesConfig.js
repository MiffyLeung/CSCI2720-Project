// backend/config/routesConfig.js
const locationRoutes = require('../routes/locationRoutes');
const authRoutes = require('../routes/authRoutes');

module.exports = [
    {
        name: 'Locations',
        basePath: '/api/locations',
        router: locationRoutes,
        routes: [
            { method: 'GET', path: '/', requiresAuth: true },
            { method: 'GET', path: '/:id', requiresAuth: true },
            { method: 'POST', path: '/', requiresAuth: true, adminOnly: true },
            { method: 'PUT', path: '/:id', requiresAuth: true, adminOnly: true },
            { method: 'DELETE', path: '/:id', requiresAuth: true, adminOnly: true },
        ],
    },
    {
        name: 'Auth',
        basePath: '/api/auth',
        router: authRoutes,
        routes: [
            { method: 'POST', path: '/login', requiresAuth: false },
            { method: 'PUT', path: '/change-password', requiresAuth: true },
            { method: 'GET', path: '/accounts', requiresAuth: true, adminOnly: true },
            { method: 'PUT', path: '/update', requiresAuth: true, adminOnly: true },
            { method: 'PUT', path: '/ban', requiresAuth: true, adminOnly: true },
        ],
    },
];
