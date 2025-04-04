import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { selectFcmToken } from '../../states/slices/auth';
import { useLoginWithGoogleMutation, useRegisterWithGoogleMutation } from '../../states/api/auth';
import { setBasicInfoFromGoogle } from '../../states/slices/onboarding';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID', // Get this from your Firebase console
});

const GoogleSignInButton = ({ mode = 'login', onStart, onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const fcmToken = useSelector(selectFcmToken);

    const [loginWithGoogle] = useLoginWithGoogleMutation();
    const [registerWithGoogle] = useRegisterWithGoogleMutation();

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            if (onStart) onStart();

            // Google Sign-In
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            // Get the ID token
            const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);

            // Sign in to Firebase 
            const userCredential = await signInWithCredential(auth, googleCredential);
            const firebaseUser = userCredential.user;

            // Prepare data for API
            const googleData = {
                email: firebaseUser.email,
                googleIdToken: userInfo.idToken,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                fcmToken
            };

            // Call appropriate API based on mode
            let result;
            if (mode === 'login') {
                result = await loginWithGoogle(googleData).unwrap();
            } else {
                result = await registerWithGoogle(googleData).unwrap();
            }

            // Handle successful authentication
            if (result.isNewUser) {
                // Pre-populate form with Google data
                const names = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : ['', ''];
                dispatch(setBasicInfoFromGoogle({
                    first_name: names[0] || '',
                    last_name: names.slice(1).join(' ') || '',
                    avatar: firebaseUser.photoURL || null
                }));

                // Redirect to onboarding for new users
                navigation.navigate('BasicInformation');
            } else {
                // Redirect existing users to main app
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'DefaultNav' }],
                });
            }

            Toast.show({
                type: 'success',
                text1: mode === 'login' ? 'Successfully signed in with Google!' : 'Account created with Google!',
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Google sign-in error:', error);

            // Handle specific errors
            let errorMessage = 'Google sign-in failed';
            if (error.code === 'SIGN_IN_CANCELLED') {
                errorMessage = 'Sign in cancelled';
            } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                errorMessage = 'Google Play Services not available';
            } else if (error.data?.message) {
                errorMessage = error.data.message;
            }

            Toast.show({
                type: 'error',
                text1: 'Authentication Failed',
                text2: errorMessage,
            });

            if (onError) onError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <>
                    <Icon name="google" size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                        {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                    </Text>
                </>
            )}
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
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default GoogleSignInButton;
