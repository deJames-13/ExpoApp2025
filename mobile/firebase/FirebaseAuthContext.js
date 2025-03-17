import React, { createContext, useContext } from 'react';
import useFirebaseAuth from './useFirebaseAuth';

// Create the authentication context
const FirebaseAuthContext = createContext({
    user: null,
    loading: true,
    error: null,
    registerWithEmail: async () => { },
    loginWithEmail: async () => { },
    signInWithGoogle: async () => { },
    logout: async () => { },
    resetPassword: async () => { },
});

// Provider component that wraps the app and makes auth object available
export const FirebaseAuthProvider = ({ children }) => {
    const auth = useFirebaseAuth();

    return (
        <FirebaseAuthContext.Provider value={auth}>
            {children}
        </FirebaseAuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(FirebaseAuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within a FirebaseAuthProvider');
    }

    return context;
};
