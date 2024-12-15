// frontend/src/core/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface AuthState {
    token: string | null;
    username: string | null;
    role: string | null;
}

interface AuthContextType extends AuthState {
    isAuthenticated: boolean;
    isAdmin: boolean;
    updateAuth: (token: string, username: string, role: string) => void;
    resetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        token: null,
        username: null,
        role: null,
    });

    const isAuthenticated = !!authState.token;
    const isAdmin = isAuthenticated && authState.role === 'admin';

    const updateAuth = (token: string, username: string, role: string) => {
        setAuthState({ token, username, role }); // Correct type now
    };

    const resetAuth = () => {
        setAuthState({ token: null, username: null, role: null });
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                isAuthenticated,
                isAdmin,
                updateAuth,
                resetAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
