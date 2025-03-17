import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Text, TextInput, TouchableRipple, Button } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import styles from '~/styles/auth';
import { useAuth } from '~/firebase/FirebaseAuthContext';
import Toast from 'react-native-toast-message';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);

    const { loginWithEmail, signInWithGoogle, loading, error } = useAuth();

    const validateForm = () => {
        let isValid = true;

        // Email validation
        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Password validation
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (validateForm()) {
            try {
                await loginWithEmail(email, password);
                navigation.navigate('DefaultNav');
            } catch (error) {
                // Error handling is done in useFirebaseAuth hook with Toast
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            console.log('Starting Google sign-in process...');

            // Check if environment variables are available
            if (Platform.OS === 'web' && !process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
                throw new Error('Google Web Client ID is not configured');
            } else if (Platform.OS === 'android' && !process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID) {
                throw new Error('Google Android Client ID is not configured');
            } else if (Platform.OS === 'ios' && !process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID) {
                throw new Error('Google iOS Client ID is not configured');
            }

            const result = await signInWithGoogle();
            console.log('Google sign-in initiated successfully');

            if (result?.type === 'success') {
                navigation.navigate('DefaultNav');
            }
        } catch (error) {
            console.error('Google login error:', error);
            Toast.show({
                type: 'error',
                text1: 'Google Sign-in Error',
                text2: error.message || 'Failed to authenticate with Google'
            });
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.card}>
                    <H1 style={styles.title}>Welcome Back</H1>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    <TextInput
                        label="Email"
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        outlineColor="#ddd"
                        activeOutlineColor="#6200ee"
                        left={<TextInput.Icon icon="email" />}
                        value={email}
                        onChangeText={setEmail}
                        error={!!emailError}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <TextInput
                        label="Password"
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry
                        outlineColor="#ddd"
                        activeOutlineColor="#6200ee"
                        left={<TextInput.Icon icon="lock" />}
                        value={password}
                        onChangeText={setPassword}
                        error={!!passwordError}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableRipple
                        style={styles.button}
                        onPress={handleLogin}
                        borderless
                        rippleColor="rgba(255, 255, 255, 0.2)"
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>LOGIN</Text>
                        )}
                    </TouchableRipple>

                    <View style={[styles.separator, { marginVertical: 20 }]}>
                        <View style={styles.line} />
                        <Text style={styles.separatorText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <TouchableRipple
                        style={[styles.button, styles.googleButton]}
                        onPress={handleGoogleLogin}
                        borderless
                        disabled={loading || googleLoading}
                    >
                        <View style={styles.googleButtonContent}>
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleButtonText}>
                                {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                            </Text>
                        </View>
                    </TouchableRipple>
                </View>

                <View style={styles.registerContainer}>
                    <Text style={styles.noAccountText}>Don't have an account?</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.replace("GuestNav", {
                                screen: 'Register',
                            });
                        }}
                    >
                        <Text style={styles.registerText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

