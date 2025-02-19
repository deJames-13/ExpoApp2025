import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { H1 } from '~/components/ui/typography';

export default function Login() {
    const navigation = useNavigation();

    const handleLogin = () => {
        navigation.navigate('DefaultNav');
    };

    return (
        <View style={styles.container}>
            <H1 style={styles.title}>Login</H1>
            <TextInput
                label="Email"
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                mode="outlined"
                style={styles.input}
                secureTextEntry
            />
            <TouchableRipple
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableRipple>
            <View style={styles.registerContainer}>
                <Text>Doesn't have an account?</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("GuestNav", {
                            screen: 'Register',
                        });
                    }}
                >
                    <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        marginBottom: 32,
    },
    input: {
        width: '100%',
        marginBottom: 16,
    },
    button: {
        width: '100%',
        padding: 16,
        backgroundColor: '#6200ee',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    registerText: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: '#6200ee',
    },
});