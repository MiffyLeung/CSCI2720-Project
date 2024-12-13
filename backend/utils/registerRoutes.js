// backend/utils/registerRoutes.js

const routesConfig = require('../routes/routesConfig');

/**
 * Registers all routes in the application using the configuration defined in `routesConfig`.
 * 
 * Each route's base path, HTTP methods, and additional details (authentication, admin-only access) 
 * are logged to the console for reference.
 * 
 * @function registerRoutes
 * @param {Object} app - Express application instance
 * @returns {void}
 */
const registerRoutes = (app) => {
    // Register routes using the router and base path
    routesConfig.forEach(({ basePath, router }) => {
        app.use(basePath, router);
    });

    // Log all registered routes for debugging and reference
    console.log('Registered routes:');
    routesConfig.forEach(({ name, basePath, routes }) => {
        console.log(`  - ${name}:`);
        routes.forEach(({ method, path, requiresAuth, adminOnly }) => {
            const authNote = requiresAuth
                ? adminOnly
                    ? ' (Admin Only)'
                    : ' (Authenticated)'
                : '';
            console.log(`    - ${method} ${basePath}${path}${authNote}`);
        });
    });
};

module.exports = registerRoutes;
