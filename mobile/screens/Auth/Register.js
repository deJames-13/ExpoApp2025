import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Image, StatusBar, SafeAreaView } from 'react-native';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';
import styles from '~/styles/auth';

export default function Register() {
    const navigation = useNavigation();

    const handleRegister = () => {
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

                    <TouchableRipple
                        style={styles.button}
                        onPress={handleRegister}
                        borderless
                        rippleColor="rgba(255, 255, 255, 0.2)"
                    >
                        <Text style={styles.buttonText}>REGISTER</Text>
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
