// backend/utils/logger.js
const onHeaders = require('on-headers');

// Log incoming requests
const logRequest = (req, res, next) => {
    console.log('\nIncoming Request:');
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
};

// Log outgoing responses
const logResponse = (req, res, next) => {
    onHeaders(res, () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response Headers:', res.getHeaders());
    });

    const originalSend = res.send;
    res.send = function (body) {
        console.log('\nResponse Body:', body);
        originalSend.call(this, body);
    };

    next();
};

module.exports = {
    logRequest,
    logResponse,
};
