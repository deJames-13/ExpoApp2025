import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from './theme/colors';
import { statusColors } from './styles/adminThemeUtils';

// Create consistent toast styles using the project's style system
const styles = StyleSheet.create({
    toastContainer: {
        width: '90%',
        minHeight: 60,
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        // Shadow styling consistent with cards in the app
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    successContainer: {
        backgroundColor: statusColors.success,
    },
    errorContainer: {
        backgroundColor: statusColors.error,
    },
    infoContainer: {
        backgroundColor: statusColors.info,
    },
    warningContainer: {
        backgroundColor: statusColors.warning,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    messageText: {
        fontSize: 14,
        color: 'white',
        marginTop: 2,
    },
    warningTitle: {
        color: '#855000',
    },
    warningMessage: {
        color: '#855000',
    }
});

// Toast configuration using StyleSheet styles
const toastConfig = {
    success: ({ text1, text2, ...rest }) => (
        <View style={[styles.toastContainer, styles.successContainer]}>
            <Text style={styles.titleText}>{text1}</Text>
            {text2 ? <Text style={styles.messageText}>{text2}</Text> : null}
        </View>
    ),

    error: ({ text1, text2, ...rest }) => (
        <View style={[styles.toastContainer, styles.errorContainer]}>
            <Text style={styles.titleText}>{text1}</Text>
            {text2 ? <Text style={styles.messageText}>{text2}</Text> : null}
        </View>
    ),

    info: ({ text1, text2, ...rest }) => (
        <View style={[styles.toastContainer, styles.infoContainer]}>
            <Text style={styles.titleText}>{text1}</Text>
            {text2 ? <Text style={styles.messageText}>{text2}</Text> : null}
        </View>
    ),

    warning: ({ text1, text2, ...rest }) => (
        <View style={[styles.toastContainer, styles.warningContainer]}>
            <Text style={[styles.titleText, styles.warningTitle]}>{text1}</Text>
            {text2 ? <Text style={[styles.messageText, styles.warningMessage]}>{text2}</Text> : null}
        </View>
    ),
};

export default toastConfig;
