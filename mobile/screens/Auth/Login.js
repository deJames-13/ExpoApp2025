import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Text, TextInput, TouchableRipple, Button, Divider } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import styles, { colors } from '~/styles/auth';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useLoginMutation } from '~/states/api/auth';
import { useSelector } from 'react-redux';
import { selectFcmToken } from '~/states/slices/auth';
import GoogleSignInButton from '~/components/ui/GoogleSignInButton';

export function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const fcmToken = useSelector(selectFcmToken);

    const [login, { isLoading }] = useLoginMutation();

    const [showSplash, setShowSplash] = useState(false);

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
                setShowSplash(true); // Show splash screen before API call

                // Include fcmToken in login request
                const credentials = {
                    email,
                    password,
                    fcmToken: fcmToken
                };

                const result = await login(credentials).unwrap();
                Toast.show({
                    type: 'success',
                    text1: 'Welcome Back!',
                    text2: 'You have successfully logged in!',
                });
                setShowSplash(false); // Hide splash screen after success
                navigation.navigate('DefaultNav');
            } catch (error) {
                setShowSplash(false); // Hide splash screen on error
                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: error.data?.message || 'An error occurred during login.',
                });
            }
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
                    <Text style={{ marginTop: 20, fontSize: 16, color: '#333' }}>Logging in...</Text>
                </View>
            )}

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
                        textColor={colors.text.primary}
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
                        textColor={colors.text.primary}
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
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>LOGIN</Text>
                        )}
                    </TouchableRipple>

                    {/* Google Sign-In */}
                    <View style={styles.socialLoginContainer}>
                        <Divider style={styles.divider}>
                            <Text style={styles.dividerText}>OR</Text>
                        </Divider>
                        
                        <GoogleSignInButton 
                            onStart={() => setShowSplash(true)}
                            onSuccess={() => setShowSplash(false)}
                            onError={() => setShowSplash(false)}
                            mode="login"
                        />
                    </View>

                    <View style={styles.guestButtonContainer}>
                        <Button
                            mode="text"
                            onPress={() => navigation.navigate('Home')}
                            uppercase={false}
                        >
                            Browse Shop as Guest
                        </Button>
                    </View>
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

