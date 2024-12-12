// frontend\src\index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// if (process.env.NODE_ENV === 'production') {
//     console.log = () => { }; // Override console.log
//     console.warn = () => { }; // Optionally disable console.warn
//     // console.error = () => { }; // Optionally disable console.error
// }

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
        <App />
        </React.StrictMode>
    );
} else {
    console.error("Root element not found. Ensure there is an element with id 'root' in your HTML.");
}
