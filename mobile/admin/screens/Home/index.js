import { View, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { Text, Card } from 'react-native-paper'

export function Home() {
    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineLarge" style={styles.header}>Admin Home</Text>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="bodyLarge">
                        Welcome to the EyeZone Admin Portal. Use the drawer menu or bottom tabs to navigate to different sections.
                    </Text>
                </Card.Content>
            </Card>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        marginBottom: 16,
    }
})

export default Home;
