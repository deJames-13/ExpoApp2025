import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

/**
 * A reusable component to display HTTP errors while maintaining navigation structure
 * 
 * @param {Object} props Component properties
 * @param {number} props.statusCode HTTP status code (e.g., 404, 500)
 * @param {string} props.message Custom error message
 * @param {string} props.resourceType Type of resource that wasn't found (e.g., "Product", "Order")
 * @param {function} props.onRetry Optional retry function
 */
const HttpErrorView = ({
    statusCode = 404,
    message,
    resourceType = 'Resource',
    onRetry
}) => {
    const navigation = useNavigation();

    const getErrorInfo = () => {
        switch (statusCode) {
            case 404:
                return {
                    title: `${resourceType} Not Found`,
                    icon: 'search-off',
                    description: message || `The ${resourceType.toLowerCase()} you're looking for could not be found.`
                };
            case 403:
                return {
                    title: 'Access Denied',
                    icon: 'no-encryption',
                    description: message || 'You don\'t have permission to access this resource.'
                };
            case 500:
                return {
                    title: 'Server Error',
                    icon: 'error',
                    description: message || 'Something went wrong on our server. Please try again later.'
                };
            case 0:
            case 'network':
                return {
                    title: 'Network Error',
                    icon: 'wifi-off',
                    description: message || 'Unable to connect to the server. Please check your internet connection.'
                };
            default:
                return {
                    title: 'Error Occurred',
                    icon: 'warning',
                    description: message || 'An unexpected error occurred. Please try again.'
                };
        }
    };

    const errorInfo = getErrorInfo();

    return (
        <View style={styles.container}>
            <Icon name={errorInfo.icon} size={80} color="#e74c3c" />
            <Text style={styles.errorCode}>Error {statusCode}</Text>
            <Text style={styles.title}>{errorInfo.title}</Text>
            <Text style={styles.description}>{errorInfo.description}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>

                {onRetry && (
                    <TouchableOpacity style={[styles.button, styles.retryButton]} onPress={onRetry}>
                        <Icon name="refresh" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Retry</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.button, styles.homeButton]}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Icon name="home" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    errorCode: {
        fontSize: 18,
        color: '#777',
        marginTop: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 110,
    },
    retryButton: {
        backgroundColor: '#2ecc71',
    },
    homeButton: {
        backgroundColor: '#9b59b6',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
    },
});

export default HttpErrorView;
