import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import {
    GoogleOneTapSignIn,
    statusCodes,
    isErrorWithCode,
    isSuccessResponse,
    isNoSavedCredentialFoundResponse
} from '@react-native-google-signin/google-signin';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

const GoogleSignIn = ({ onSignInSuccess, onSignInFailed }) => {
    const [isSigninInProgress, setIsSigninInProgress] = useState(false);

    useEffect(() => {
        configureGoogleSignIn();
    }, []);

    const configureGoogleSignIn = () => {
        GoogleOneTapSignIn.configure({
            webClientId: 'autoDetect', // Will detect from Firebase config
        });

        // For web platform, set up the listener
        if (Platform.OS === 'web') {
            GoogleOneTapSignIn.signIn(
                { ux_mode: 'popup' },
                {
                    onResponse: (response) => {
                        if (isSuccessResponse(response)) {
                            handleGoogleSignIn(response.data);
                        }
                    },
                    onError: handleSignInError,
                }
            );
        }
    };

    const handleGoogleSignIn = async (userInfo) => {
        try {
            // Use the ID token to sign in with Firebase Auth
            const { idToken } = userInfo;
            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, credential);

            if (onSignInSuccess) {
                onSignInSuccess(userCredential.user);
            }
        } catch (error) {
            console.error("Firebase authentication failed:", error);
            if (onSignInFailed) {
                onSignInFailed(error);
            }
        }
    };

    const handleSignInError = (error) => {
        console.error("Google Sign-In error:", error);
        if (onSignInFailed) {
            onSignInFailed(error);
        }
    };

    const signIn = async () => {
        if (isSigninInProgress) return;

        setIsSigninInProgress(true);
        try {
            await GoogleOneTapSignIn.checkPlayServices();
            const response = await GoogleOneTapSignIn.signIn();

            if (isSuccessResponse(response)) {
                await handleGoogleSignIn(response.data);
            } else if (isNoSavedCredentialFoundResponse(response)) {
                // No saved credential, attempt to create new account
                await createAccount();
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.ONE_TAP_START_FAILED:
                        // Try explicit sign in as a fallback
                        await presentExplicitSignIn();
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.error("Play services not available:", error.userInfo);
                        handleSignInError(error);
                        break;
                    default:
                        handleSignInError(error);
                }
            } else {
                handleSignInError(error);
            }
        } finally {
            setIsSigninInProgress(false);
        }
    };

    const createAccount = async () => {
        try {
            const response = await GoogleOneTapSignIn.createAccount();
            if (isSuccessResponse(response)) {
                await handleGoogleSignIn(response.data);
            }
        } catch (error) {
            handleSignInError(error);
        }
    };

    const presentExplicitSignIn = async () => {
        try {
            const response = await GoogleOneTapSignIn.presentExplicitSignIn();
            if (isSuccessResponse(response)) {
                await handleGoogleSignIn(response.data);
            }
        } catch (error) {
            handleSignInError(error);
        }
    };

    const signOut = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                await GoogleOneTapSignIn.signOut(currentUser.email);
                await auth.signOut();
            }
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <TouchableOpacity
            style={styles.googleButton}
            onPress={signIn}
            disabled={isSigninInProgress}
        >
            <Text style={styles.buttonText}>
                {isSigninInProgress ? "Signing in..." : "Sign in with Google"}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    googleButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default GoogleSignIn;
