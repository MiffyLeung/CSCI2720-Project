// frontend/src/pages/LoginPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../utils/secure';
import { apiRequest } from '../utils/api';

const LoginPage: React.FC = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const [username, setUsername] = React.useState(isDevelopment ? 'admin' : '');
  const [password, setPassword] = React.useState(isDevelopment ? 'password123' : '');
  const [error, setError] = React.useState<string | null>(null);
  const { isAuthenticated, authInitialized, isAdmin, setAuth, cleanAuth } = useAuthState();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authInitialized && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authInitialized, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Send login request
    const data = await apiRequest(
      '/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      },
      cleanAuth // Inject cleanAuth for handling token errors
    );

    try {
      setAuth(data.token, data.username, data.role);
      navigate('/'); // Redirect to homepage after successful login
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center text-primary mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
