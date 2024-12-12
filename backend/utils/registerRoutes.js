// backend/utils/registerRoutes.js
const routesConfig = require('../config/routesConfig');

const registerRoutes = (app) => {
    routesConfig.forEach(({ basePath, router }) => {
        app.use(basePath, router);
    });

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
