import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Text, TextInput, TouchableRipple, Button } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import { useAuth } from '~/firebase/FirebaseAuthContext';
import styles from '~/styles/auth';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import api from '~/axios.config'

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { loginWithEmail, signInWithGoogle, loading } = useAuth();

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

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigation.navigate('DefaultNav');
        } catch (error) {
            // Error is handled in the FirebaseAuthContext
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
                        onPress={handleGoogleSignIn}
                        borderless
                        disabled={loading}
                    >
                        <View style={styles.googleButtonContent}>
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleButtonText}>
                                {loading ? 'Signing in...' : 'Sign in with Google'}
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

