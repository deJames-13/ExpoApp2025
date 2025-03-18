import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import styles from '~/styles/auth';
import { useAuth } from '~/firebase/FirebaseAuthContext';
import Toast from 'react-native-toast-message';

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { registerWithEmail, signInWithGoogle, loading } = useAuth();

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
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            try {
                await registerWithEmail(email, password);
                navigation.navigate('DefaultNav');
            } catch (error) {
                // Error handling is done in useFirebaseAuth hook with Toast
            }
        }
    };

    const handleGoogleSignUp = async () => {
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
                    <H1 style={styles.title}>Create Account</H1>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

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

                    <TouchableRipple
                        style={styles.button}
                        onPress={handleRegister}
                        borderless
                        rippleColor="rgba(255, 255, 255, 0.2)"
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>REGISTER</Text>
                        )}
                    </TouchableRipple>

                    <View style={[styles.separator, { marginVertical: 20 }]}>
                        <View style={styles.line} />
                        <Text style={styles.separatorText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <TouchableRipple
                        style={[styles.button, styles.googleButton]}
                        onPress={handleGoogleSignUp}
                        borderless
                        disabled={loading}
                    >
                        <View style={styles.googleButtonContent}>
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                                style={styles.googleIcon}
                            />
                            <Text style={styles.googleButtonText}>Sign up with Google</Text>
                        </View>
                    </TouchableRipple>
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
        </SafeAreaView>
    );
}
