const path = require('path');
module.exports = {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // 支持的文件擴展名
};
// webpack.config.js
module.exports = {
    devServer: {
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }
            devServer.app.use((req, res, next) => {
                console.log('Custom middleware logic');
                next();
            });
            return middlewares;
        },
    },
};
