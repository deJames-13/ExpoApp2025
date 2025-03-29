import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, SafeAreaView } from 'react-native';

const LoadingScreen = ({ message }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0066cc" />
                <Text style={styles.text}>Loading...</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    }
});

// Make sure this is explicitly exported as default
export default LoadingScreen;
