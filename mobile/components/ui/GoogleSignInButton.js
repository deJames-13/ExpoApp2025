import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '~/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { selectFcmToken } from '~/states/slices/auth';
import { useLoginWithGoogleMutation, useRegisterWithGoogleMutation } from '~/states/api/auth';
import { setBasicInfoFromGoogle } from '~/states/slices/onboarding';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
    offlineAccess: true,
    webClientId: '30159689923-289e9bi2fvvbl9cgq2v046gj1a9ornl4.apps.googleusercontent.com',
    iosClientId: '30159689923-smgoi9h65q5q63jqh5ju7rbf1c51erdk.apps.googleusercontent.com',
    scopes: ['profile', 'email']
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
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Clear any previous sign-in first
            await GoogleSignin.signOut();

            // Perform the sign-in
            const userInfoResponse = await GoogleSignin.signIn();
            console.log("Google Sign-in successful with user info:", userInfoResponse);

            // Correctly extract information from the nested response structure
            const { idToken } = userInfoResponse.data;
            const googleUser = userInfoResponse.data.user;

            // Create the Firebase credential with the Google ID token
            const googleCredential = GoogleAuthProvider.credential(idToken);
            console.log("Created Google credential for Firebase");

            // Sign in to Firebase 
            const userCredential = await signInWithCredential(auth, googleCredential);
            const firebaseUser = userCredential.user;
            console.log("Firebase sign-in successful with user:", firebaseUser.email);

            // Prepare data for API
            const googleData = {
                email: googleUser.email,
                googleIdToken: idToken,
                displayName: googleUser.name,
                photoURL: googleUser.photo,
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
                dispatch(setBasicInfoFromGoogle({
                    first_name: googleUser.givenName || '',
                    last_name: googleUser.familyName || '',
                    avatar: googleUser.photo || null
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

            let errorMessage = 'Google sign-in failed';

            // Check for the "No account exists" error specifically
            if (error.data?.message?.includes('No account exists with this Google email')) {
                if (mode === 'login') {
                    Toast.show({
                        type: 'info',
                        text1: 'Account Not Found',
                        text2: 'You need to register with Google first. Redirecting you to registration...',
                        visibilityTime: 4000,
                    });

                    setTimeout(() => {
                        navigation.replace("GuestNav", {
                            screen: 'Register',
                        });
                    }, 2000);

                    if (onError) onError(error);
                    setIsLoading(false);
                    return;
                } else {
                    errorMessage = 'Please complete registration to continue';
                }
            } else if (error.code === 'SIGN_IN_CANCELLED') {
                errorMessage = 'Sign in cancelled';
            } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
                errorMessage = 'Google Play Services not available';
            } else if (error.code === 'auth/argument-error') {
                errorMessage = 'Authentication error - Invalid credentials format';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid credentials provided';
            } else if (error.data?.message) {
                errorMessage = error.data.message;
            }

            console.error('Google sign-in error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));

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
