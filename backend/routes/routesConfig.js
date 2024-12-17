// backend/routes/routesConfig.js

const programmeRoutes = require('./programmeRoutes');
const venueRoutes = require('./venueRoutes');
const accountRoutes = require('./accountRoutes');
const adminRoutes = require('./adminRoutes');

/**
 * Configuration for API routes, defining base paths, routers, and individual route details.
 * 
 * Each configuration object includes:
 * - name: A human-readable name for the route group.
 * - basePath: The base URL path for the route group.
 * - router: The Express router handling the group of routes.
 * - routes: An array of individual route configurations:
 *   - method: HTTP method (e.g., GET, POST).
 *   - path: Path relative to the basePath.
 *   - requiresAuth: Whether authentication is required.
 *   - adminOnly: Whether the route is restricted to admin users (optional).
 */
module.exports = [
    {
        name: 'Programmes',
        basePath: '/api',
        router: programmeRoutes,
        routes: [
            { method: 'GET', path: '/programmes', requiresAuth: true }, // List programmes with parameters (Recent / Hotest)
            { method: 'GET', path: '/programme/:id', requiresAuth: true }, // View programme in detail
            { method: 'POST', path: '/programme/:id/like', requiresAuth: true }, // User clicks like
            { method: 'POST', path: '/programme/:id/comment', requiresAuth: true }, // User leaves comment
            { method: 'POST', path: '/programme', requiresAuth: true, adminOnly: true }, // Create new programme
            { method: 'PATCH', path: '/programme/:id', requiresAuth: true, adminOnly: true }, // Update a programme
            { method: 'DELETE', path: '/programme/:id', requiresAuth: true, adminOnly: true }, // Delete a programme
        ],
    },
    {
        name: 'Venues',
        basePath: '/api',
        router: venueRoutes,
        routes: [
            { method: 'GET', path: '/venues/forMap', requiresAuth: true }, // List all venues with getLocation (for map view)
            { method: 'GET', path: '/venue/:id', requiresAuth: true }, // View a venue and its programmes
            { method: 'GET', path: '/venues', requiresAuth: true, adminOnly: true }, // List all venues for Admin Panel
            { method: 'POST', path: '/venue', requiresAuth: true, adminOnly: true }, // Create a venue
            { method: 'PATCH', path: '/venue/:id', requiresAuth: true, adminOnly: true }, // Update a venue
            { method: 'DELETE', path: '/venue/:id', requiresAuth: true, adminOnly: true }, // Delete a venue
            { method: 'POST', path: '/venue/:id/bookmark', requiresAuth: true }, // Update a venue
            { method: 'DELETE', path: '/venue/:id/bookmark', requiresAuth: true }, // Delete a venue
        ],
    },
    {
        name: 'Accounts',
        basePath: '/api',
        router: accountRoutes,
        routes: [
            { method: 'POST', path: '/login', requiresAuth: false }, // Login to an account
            { method: 'PATCH', path: '/password', requiresAuth: true }, // Change password
            { method: 'GET', path: '/myAccount', requiresAuth: true }, // Get user details
            { method: 'GET', path: '/myFavorites', requiresAuth: true }, // Get bookmarked programmes
            { method: 'GET', path: '/accounts', requiresAuth: true, adminOnly: true }, // List all accounts with filters
            { method: 'GET', path: '/account/:id', requiresAuth: true, adminOnly: true }, // Get account details
            { method: 'POST', path: '/account', requiresAuth: true, adminOnly: true }, // Create new account
            { method: 'PATCH', path: '/account/:id', requiresAuth: true, adminOnly: true }, // Modify an account
        ],
    },
    {
        name: 'Admin Tools',
        basePath: '/api',
        router: adminRoutes,
        routes: [
            { method: 'GET', path: '/adminRoutes',  requiresAuth: true, adminOnly: true }, // update Data
        ],
    },
];
