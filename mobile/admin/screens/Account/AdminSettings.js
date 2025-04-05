import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { adminColors } from '~/styles/adminTheme';

export function AdminSettings() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Admin Settings (Coming Soon)</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: adminColors.background,
    },
    text: {
        fontSize: 18,
        color: adminColors.text.primary,
    },
});

export default AdminSettings;
