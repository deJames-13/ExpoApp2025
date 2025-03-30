import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { selectActiveNotification } from '~/states/slices/notification';

const NotificationViewModal = ({ onClose }) => {
    const notification = useSelector(selectActiveNotification);
    const navigation = useNavigation();

    if (!notification) {
        return null;
    }
    console.log(notification)

    // Format the date nicely
    const formattedDate = notification.createdAt
        ? new Date(notification.createdAt).toLocaleString()
        : notification.timestamp;

    // Handle navigation to order details
    const handleViewOrder = () => {
        // Get orderId from notification data
        const orderId = notification.data?.id;

        if (orderId) {
            onClose(); // Close the modal first

            // Navigate to order details screen
            setTimeout(() => {
                navigation.navigate('Orders', {
                    screen: 'OrderDetailView',
                    params: { orderId }
                });
            }, 300); // Small delay to ensure modal is closed
        }
    };

    // Determine if this is an order notification
    const isOrderNotification = notification.data?.type === 'order';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Notification Details</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContent}>
                    <View style={styles.notificationHeader}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{notification.title}</Text>
                            <Text style={styles.timestamp}>{formattedDate}</Text>
                        </View>

                        {notification.type && (
                            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(notification.type) }]}>
                                <Text style={styles.typeText}>{notification.type}</Text>
                            </View>
                        )}
                    </View>

                    {notification.image && (
                        <Image
                            source={{ uri: notification.image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}

                    <Text style={styles.contentText}>
                        {notification.fullContent || notification.body || notification.shortDescription}
                    </Text>

                    {notification.data && Object.keys(notification.data).length > 0 && (
                        <View style={styles.additionalInfo}>
                            <Text style={styles.additionalInfoTitle}>Additional Information:</Text>
                            {Object.entries(notification.data).map(([key, value]) => (
                                <Text key={key} style={styles.dataItem}>
                                    <Text style={styles.dataKey}>{key}: </Text>
                                    <Text>{typeof value === 'object' ? JSON.stringify(value) : value}</Text>
                                </Text>
                            ))}
                        </View>
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    {isOrderNotification && notification.data?.id ? (
                        <View style={styles.footerButtonGroup}>
                            <TouchableOpacity style={styles.orderButton} onPress={handleViewOrder}>
                                <MaterialIcons name="shopping-bag" size={18} color="#fff" />
                                <Text style={styles.footerButtonText}>View Order</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeButton2} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.footerButton} onPress={onClose}>
                            <Text style={styles.footerButtonText}>Close</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

// Helper function to get color based on notification type
const getTypeColor = (type) => {
    const typeColors = {
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        important: '#9C27B0',
        order: '#3F51B5', // New color for order type
    };

    return typeColors[type.toLowerCase()] || '#2196F3';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 10,
        overflow: 'hidden',
        maxHeight: '80%',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    scrollContent: {
        padding: 16,
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginLeft: 8,
    },
    typeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    contentText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 16,
    },
    additionalInfo: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    additionalInfoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dataItem: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    dataKey: {
        fontWeight: 'bold',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 16,
    },
    footerButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderButton: {
        backgroundColor: '#3F51B5', // Different color for order button
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 2,
        marginRight: 8,
    },
    closeButton2: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        flex: 1,
    },
    closeButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    footerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default NotificationViewModal;