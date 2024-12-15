// frontend/src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/AuthContext';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter future={{
          v7_startTransition: true, 
          v7_relativeSplatPath: true, 
        }}>
        <AuthProvider>
            <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found. Ensure there is an element with id 'root' in your HTML.");
}
