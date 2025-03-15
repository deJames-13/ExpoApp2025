import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView } from 'react-native';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import styles from '~/styles/auth';

export default function Login() {
    const navigation = useNavigation();

    const handleLogin = () => {
        navigation.navigate('DefaultNav');
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
                    />

                    <TextInput
                        label="Password"
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry
                        outlineColor="#ddd"
                        activeOutlineColor="#6200ee"
                        left={<TextInput.Icon icon="lock" />}
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableRipple
                        style={styles.button}
                        onPress={handleLogin}
                        borderless
                        rippleColor="rgba(255, 255, 255, 0.2)"
                    >
                        <Text style={styles.buttonText}>LOGIN</Text>
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

