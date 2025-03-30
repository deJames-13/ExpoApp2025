import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    GoogleAuthProvider
} from './index';
import { signInWithCredential } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import useFirebaseMessaging from './useFirebaseMessaging'

// Create auth context
const FirebaseAuthContext = createContext();

// Auth provider component
export const FirebaseAuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useFirebaseMessaging()

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Login with email and password
    const loginWithEmail = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'You have successfully logged in'
            });
            return result;
        } catch (err) {
            setError(err);
            let message = 'Login failed. Please try again.';

            if (err.code === 'auth/user-not-found') {
                message = 'No account found with this email.';
            } else if (err.code === 'auth/wrong-password') {
                message = 'Incorrect password.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (err.code === 'auth/user-disabled') {
                message = 'This account has been disabled.';
            } else if (err.code === 'auth/too-many-requests') {
                message = 'Too many failed login attempts. Please try again later.';
            }

            Toast.show({
                type: 'error',
                text1: 'Login Error',
                text2: message
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Register with email and password
    const registerWithEmail = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'Your account has been created'
            });
            return result;
        } catch (err) {
            setError(err);
            let message = 'Registration failed. Please try again.';

            if (err.code === 'auth/email-already-in-use') {
                message = 'This email is already in use.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password is too weak.';
            } else if (err.code === 'auth/operation-not-allowed') {
                message = 'Email/password accounts are not enabled.';
            }

            Toast.show({
                type: 'error',
                text1: 'Registration Error',
                text2: message
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        setLoading(true);
        setError(null);
        try {
            await GoogleSignin.configure({
                webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            });

            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const { idToken } = userInfo;
            const credential = GoogleAuthProvider.credential(idToken);
            const result = await signInWithCredential(auth, credential);

            Toast.show({
                type: 'success',
                text1: 'Google Sign-in Successful',
                text2: 'You have successfully signed in with Google'
            });

            return result;
        } catch (err) {
            setError(err);
            Toast.show({
                type: 'error',
                text1: 'Google Sign-in Error',
                text2: err.message || 'Failed to authenticate with Google'
            });
            console.log(err)
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sign out
    const signOut = async () => {
        setLoading(true);
        try {
            await firebaseSignOut(auth);
            Toast.show({
                type: 'success',
                text1: 'Logout Successful',
                text2: 'You have been logged out'
            });
        } catch (err) {
            setError(err);
            Toast.show({
                type: 'error',
                text1: 'Logout Error',
                text2: 'Failed to logout. Please try again.'
            });

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Toast.show({
                type: 'success',
                text1: 'Password Reset Email Sent',
                text2: 'Check your email for password reset instructions'
            });
        } catch (err) {
            setError(err);
            let message = 'Failed to send password reset email.';

            if (err.code === 'auth/user-not-found') {
                message = 'No account found with this email.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Invalid email address.';
            }

            Toast.show({
                type: 'error',
                text1: 'Password Reset Error',
                text2: message
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        loading,
        error,
        loginWithEmail,
        registerWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
    };

    return (
        <FirebaseAuthContext.Provider value={value}>
            {children}
        </FirebaseAuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(FirebaseAuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a FirebaseAuthProvider');
    }
    return context;
};
