import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { Text, TextInput, TouchableRipple, Button, Divider } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import styles, { colors } from '~/styles/auth';
import Toast from 'react-native-toast-message';
import { useRegisterMutation } from '~/states/api/auth';
import { useSelector } from 'react-redux';
import { selectHasBasicInfo, selectIsEmailVerified, selectFcmToken } from '~/states/slices/auth';
import GoogleSignInButton from '~/components/ui/GoogleSignInButton';

export function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSplash, setShowSplash] = useState(false); // Enhanced loading state with splash screen

    const hasBasicInfo = useSelector(selectHasBasicInfo);
    const isEmailVerified = useSelector(selectIsEmailVerified);
    const fcmToken = useSelector(selectFcmToken); // Get fcmToken from Redux store

    const [register, { isLoading }] = useRegisterMutation();

    const validateForm = () => {
        let isValid = true;

        // Username validation
        if (!username.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        } else {
            setUsernameError('');
        }

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
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        // Confirm Password validation
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            try {
                setShowSplash(true); // Show splash screen before API call

                const result = await register({
                    email,
                    password,
                    confirm_password: confirmPassword,
                    username,
                    fcmToken: fcmToken // Add FCM token to registration data
                }).unwrap();

                setShowSplash(false); // Hide splash screen after success

                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Account created successfully! Complete your profile.',
                });

                // Navigate to the appropriate onboarding step
                navigateToNextOnboardingStep();
            } catch (error) {
                setShowSplash(false); // Hide splash screen on error

                console.log('Registration error:', JSON.stringify(error, null, 2));

                let errorMessage = 'An error occurred during registration.';

                if (error.data?.message) {
                    errorMessage = error.data.message;
                } else if (error.status === 500) {
                    errorMessage = 'Server error. Please try again later or contact support.';
                }

                if (error.stack) {
                    console.error('Server error stack:', error.stack);
                }

                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: errorMessage,
                });
            }
        }
    };

    const navigateToNextOnboardingStep = () => {
        if (!hasBasicInfo) {
            navigation.navigate("BasicInformation");
        } else if (!isEmailVerified) {
            navigation.navigate("EmailVerification");
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: 'DefaultNav' }],
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#f8f8f8" barStyle="dark-content" />

            {/* Splash Screen Overlay */}
            {showSplash && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <Image
                        source={require('../../assets/icon.png')}
                        style={{ width: 120, height: 120, marginBottom: 20 }}
                        resizeMode="contain"
                    />
                    <ActivityIndicator size="large" color="#6200ee" />
                    <Text style={{ marginTop: 20, fontSize: 16, color: '#333' }}>Creating your account...</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.card}>
                        <H1 style={styles.title}>Create Account</H1>
                        <Text style={styles.subtitle}>Sign up to get started</Text>

                        {/* Google Sign-In (at the top for easier visibility) */}
                        <GoogleSignInButton
                            onStart={() => setShowSplash(true)}
                            onSuccess={() => setShowSplash(false)}
                            onError={() => setShowSplash(false)}
                            mode="register"
                        />

                        <Divider style={styles.divider}>
                            <Text style={styles.dividerText}>OR</Text>
                        </Divider>

                        <TextInput
                            label="Username"
                            mode="outlined"
                            style={styles.input}
                            autoCapitalize="none"
                            outlineColor="#ddd"
                            activeOutlineColor="#6200ee"
                            left={<TextInput.Icon icon="account" />}
                            textColor={colors.text.primary}
                            value={username}
                            onChangeText={setUsername}
                            error={!!usernameError}
                        />
                        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

                        <TextInput
                            label="Email"
                            mode="outlined"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            outlineColor="#ddd"
                            textColor={colors.text.primary}
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
                            secureTextEntry={!showPassword}
                            outlineColor="#ddd"
                            textColor={colors.text.primary}
                            activeOutlineColor="#6200ee"
                            left={<TextInput.Icon icon="lock" />}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                    forceTextInputFocus={false}
                                />
                            }
                            value={password}
                            onChangeText={setPassword}
                            error={!!passwordError}
                        />
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                        <TextInput
                            label="Confirm Password"
                            mode="outlined"
                            style={styles.input}
                            secureTextEntry={!showConfirmPassword}
                            outlineColor="#ddd"
                            textColor={colors.text.primary}
                            activeOutlineColor="#6200ee"
                            left={<TextInput.Icon icon="lock-check" />}
                            right={
                                <TextInput.Icon
                                    icon={showConfirmPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    forceTextInputFocus={false}
                                />
                            }
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            error={!!confirmPasswordError}
                        />
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                        <TouchableRipple
                            style={styles.button}
                            onPress={handleRegister}
                            borderless
                            rippleColor="rgba(255, 255, 255, 0.2)"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>REGISTER</Text>
                            )}
                        </TouchableRipple>

                        <View style={styles.guestButtonContainer}>
                            <Button
                                mode="text"
                                onPress={() => navigation.navigate('Home')}
                                uppercase={false}
                            >
                                Browse Shop
                            </Button>
                        </View>
                    </View>

                    <View style={styles.loginContainer}>
                        <Text style={styles.accountText}>Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.replace("GuestNav", {
                                    screen: 'Login',
                                });
                            }}
                        >
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
