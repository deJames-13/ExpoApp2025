import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { statusColors } from './styles/adminThemeUtils';
import { Ionicons } from '@expo/vector-icons';

// Create consistent toast styles using the project's style system
const styles = StyleSheet.create({
    toastContainer: {
        width: '90%',
        minHeight: 60,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
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
    iconContainer: {
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
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
    },
    closeButton: {
        marginLeft: 8,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
    },
    warningCloseButton: {
        color: '#855000',
    },
    actionableToast: {
        borderLeftWidth: 4,
        borderLeftColor: '#0066cc',
    }
});

// Toast configuration using StyleSheet styles
const toastConfig = {
    success: ({ text1, text2, onPress, ...rest }) => (
        <View style={[styles.toastContainer, styles.successContainer]}>
            <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="white" />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.titleText} accessibilityRole="alert">{text1}</Text>
                {text2 ? <Text style={styles.messageText}>{text2}</Text> : null}
            </View>
            {onPress && (
                <TouchableOpacity style={styles.closeButton} onPress={onPress} accessibilityLabel="Close notification">
                    <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
            )}
        </View>
    ),

    error: ({ text1, text2, onPress, ...rest }) => (
        <View style={[styles.toastContainer, styles.errorContainer]}>
            <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={24} color="white" />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.titleText} accessibilityRole="alert">{text1}</Text>
                {text2 ? <Text style={styles.messageText}>{text2}</Text> : null}
            </View>
            {onPress && (
                <TouchableOpacity style={styles.closeButton} onPress={onPress} accessibilityLabel="Close notification">
                    <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
            )}
        </View>
    ),

    info: ({ text1, text2, onPress, ...rest }) => (
        <View style={[styles.toastContainer, styles.infoContainer]}>
            <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={24} color="white" />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.titleText} accessibilityRole="alert">{text1}</Text>
                {text2 ? <Text style={styles.messageText}>{text2}</Text> : null}
            </View>
            {onPress && (
                <TouchableOpacity style={styles.closeButton} onPress={onPress} accessibilityLabel="Close notification">
                    <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
            )}
        </View>
    ),

    warning: ({ text1, text2, onPress, ...rest }) => (
        <View style={[styles.toastContainer, styles.warningContainer]}>
            <View style={styles.iconContainer}>
                <Ionicons name="warning" size={24} color="#855000" />
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.titleText, styles.warningTitle]} accessibilityRole="alert">{text1}</Text>
                {text2 ? <Text style={[styles.messageText, styles.warningMessage]}>{text2}</Text> : null}
            </View>
            {onPress && (
                <TouchableOpacity style={styles.closeButton} onPress={onPress} accessibilityLabel="Close notification">
                    <Ionicons name="close" size={20} color="#855000" />
                </TouchableOpacity>
            )}
        </View>
    ),

    actionable: ({ text1, text2, onPress, type = 'info', ...rest }) => {
        // Determine colors based on type
        const containerStyle = styles[`${type}Container`] || styles.infoContainer;
        const iconName = type === 'success' ? 'checkmark-circle' :
            type === 'error' ? 'alert-circle' :
                type === 'warning' ? 'warning' : 'information-circle';
        const iconColor = type === 'warning' ? '#855000' : 'white';
        const textStyle = type === 'warning' ? styles.warningTitle : styles.titleText;
        const messageStyle = type === 'warning' ? styles.warningMessage : styles.messageText;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                disabled={!onPress}
            >
                <View style={[styles.toastContainer, containerStyle, styles.actionableToast]}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={iconName} size={24} color={iconColor} />
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={textStyle} accessibilityRole="alert">{text1}</Text>
                        {text2 ? <Text style={messageStyle}>{text2}</Text> : null}
                    </View>
                    {onPress && (
                        <View style={styles.closeButton}>
                            <Ionicons name="chevron-forward" size={22} color={iconColor} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }
};

export default toastConfig;
