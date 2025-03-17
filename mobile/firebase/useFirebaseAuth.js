import { useState, useEffect } from 'react';
// import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithCredential
} from './index';
import Toast from 'react-native-toast-message';

// Configure WebBrowser for OAuth flows
// WebBrowser.maybeCompleteAuthSession();

const useFirebaseAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Google OAuth configuration
    const [googleRequest, googleResponse, promptGoogleAsync] = Google.useIdTokenAuthRequest(
        {
            clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        }
    );

    // Process Google sign in response
    useEffect(() => {
        if (googleResponse?.type === 'success') {
            setLoading(true);
            const { id_token } = googleResponse.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then((result) => {
                    setUser(result.user);
                    Toast.show({
                        type: 'success',
                        text1: 'Google Sign-in Success',
                        text2: 'Welcome back!'
                    });
                })
                .catch((error) => {
                    setError(error.message);
                    Toast.show({
                        type: 'error',
                        text1: 'Google Sign-in Failed',
                        text2: error.message
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [googleResponse]);

    // Listen to the Firebase Auth state and set the local state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setLoading(true);
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
            setError(null);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Google Sign In
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await promptGoogleAsync();
            if (result.type !== 'success') {
                throw new Error('Google sign in was cancelled or failed');
            }
            // The actual sign in will be handled by the useEffect above
            return result;
        } catch (error) {
            setError(error.message);
            Toast.show({
                type: 'error',
                text1: 'Google Sign-in Failed',
                text2: error.message
            });
            setLoading(false);
            throw error;
        }
    };

    // Sign up with email and password
    const registerWithEmail = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            Toast.show({
                type: 'success',
                text1: 'Registration Success',
                text2: 'Your account has been created successfully!'
            });
            return userCredential.user;
        } catch (error) {
            setError(error.message);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error.message
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with email and password
    const loginWithEmail = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            Toast.show({
                type: 'success',
                text1: 'Login Success',
                text2: 'Welcome back!'
            });
            return userCredential.user;
        } catch (error) {
            setError(error.message);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.message
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign out
    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            Toast.show({
                type: 'success',
                text1: 'Logout Success',
                text2: 'You have been logged out'
            });
        } catch (error) {
            setError(error.message);
            Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: error.message
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Password reset
    const resetPassword = async (email) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Toast.show({
                type: 'success',
                text1: 'Email Sent',
                text2: 'Check your email for password reset instructions'
            });
        } catch (error) {
            setError(error.message);
            Toast.show({
                type: 'error',
                text1: 'Password Reset Failed',
                text2: error.message
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        registerWithEmail,
        loginWithEmail,
        signInWithGoogle,
        logout,
        resetPassword,
    };
};

export default useFirebaseAuth;
