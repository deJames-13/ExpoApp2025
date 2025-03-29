import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text, TextInput, TouchableRipple, Button } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import styles from '~/styles/auth';
import Toast from 'react-native-toast-message';
import { useRegisterMutation } from '~/states/api/auth';
import { useSelector } from 'react-redux';
import { selectHasBasicInfo, selectIsEmailVerified } from '~/states/slices/auth';

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const hasBasicInfo = useSelector(selectHasBasicInfo);
    const isEmailVerified = useSelector(selectIsEmailVerified);

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

        return isValid;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            try {
                const result = await register({ email, password, username }).unwrap();
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Account created successfully! Complete your profile.',
                });

                // Navigate to the appropriate onboarding step
                navigateToNextOnboardingStep();
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: error.data?.message || 'An error occurred during registration.',
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
            // If somehow all steps are complete, go to main app
            navigation.reset({
                index: 0,
                routes: [{ name: 'DefaultNav' }],
            });
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
                        label="Username"
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        outlineColor="#ddd"
                        activeOutlineColor="#6200ee"
                        left={<TextInput.Icon icon="account" />}
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
        </SafeAreaView>
    );
}
