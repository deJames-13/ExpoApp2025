import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NotificationCard = ({
    notification,
    level = notification?.isRead ? 0 : 1,
    selectionMode,
    isSelected,
    onSelect,
    onMarkAsRead,
    onViewDetails
}) => {
    const [expanded, setExpanded] = useState(false);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    // Icons for different notification levels
    const notificationLevelIcon = {
        0: 'notifications-none', // Already read
        1: 'notifications',      // Not read, old
        2: 'notifications-active', // Not read, new
        3: 'notifications-important', // Not read, latest and important
    };

    // Colors for different notification levels
    const notificationLevelColor = {
        0: '#999', // Grey for read notifications
        1: '#2196F3', // Blue for unread notifications
        2: '#FF9800', // Orange for new notifications
        3: '#FF5252', // Red for important notifications
    };

    // Border styles for different notification levels
    const getBorderStyle = () => {
        if (level === 0) return {}; // No border for read notifications

        return {
            borderLeftWidth: 3,
            borderLeftColor: notificationLevelColor[level],
        };
    };

    // Toggle expanded state for accordion effect
    const toggleExpand = () => {
        if (!selectionMode) {
            if (!expanded && !notification.isRead) {
                onMarkAsRead();
            }

            setExpanded(!expanded);
            Animated.timing(animatedHeight, {
                toValue: expanded ? 0 : 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            onSelect();
        }
    };

    // Handle navigation to order details
    const handleViewOrder = () => {
        // Get orderId from notification data
        const orderId = notification.data?.id;

        if (orderId) {
            // Navigate to order details screen
            navigation.navigate('Orders', {
                screen: 'OrderDetailView',
                params: { orderId }
            });
        }
    };

    // Determine if this is an order notification
    const isOrderNotification = notification.data?.type === 'order';

    // Calculate max height for animation
    const maxHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200]
    });

    return (
        <View style={[
            styles.container,
            getBorderStyle()
        ]}>
            <TouchableOpacity
                style={styles.cardHeader}
                onPress={toggleExpand}
            >
                {selectionMode && (
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={onSelect}
                    >
                        <View style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected
                        ]}>
                            {isSelected && (
                                <MaterialIcons name="check" size={16} color="#fff" />
                            )}
                        </View>
                    </TouchableOpacity>
                )}

                <MaterialIcons
                    name={notificationLevelIcon[level]}
                    size={22}
                    color={notificationLevelColor[level]}
                />

                <View style={styles.contentContainer}>
                    <View style={styles.titleRow}>
                        <Text style={[
                            styles.title,
                            !notification.isRead && styles.unreadTitle
                        ]} numberOfLines={1}>
                            {notification.title}
                            {notification.status === 'important' && ' ⚠️'}
                        </Text>
                        <Text style={styles.timestamp}>
                            {notification.timestamp || new Date(notification.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                    <Text style={styles.description} numberOfLines={2}>
                        {notification.shortDescription || notification.body}
                    </Text>

                    {!notification.isRead && (
                        <View style={[
                            styles.unreadIndicator,
                            { backgroundColor: notificationLevelColor[level] }
                        ]} />
                    )}
                </View>

                <MaterialIcons
                    name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={24}
                    color="#999"
                />
            </TouchableOpacity>

            <Animated.View style={[styles.expandedSection, { maxHeight }]}>
                <Text style={styles.fullContent}>
                    {notification.fullContent || notification.body}
                </Text>

                <View style={styles.cardActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onViewDetails(notification)}
                    >
                        <MaterialIcons name="visibility" size={22} color="#2196F3" />
                        <Text style={styles.actionText}>View</Text>
                    </TouchableOpacity>

                    {isOrderNotification && notification.data?.id && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleViewOrder}
                        >
                            <MaterialIcons name="shopping-bag" size={22} color="#3F51B5" />
                            <Text style={styles.actionText}>Go to Order</Text>
                        </TouchableOpacity>
                    )}

                    {!notification.isRead && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={onMarkAsRead}
                        >
                            <MaterialIcons name="done" size={22} color="#4CAF50" />
                            <Text style={styles.actionText}>Mark Read</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    unreadContainer: {
        borderLeftWidth: 3,
        borderLeftColor: '#2196F3',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    checkboxContainer: {
        marginRight: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#2196F3',
    },
    contentContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    unreadTitle: {
        fontWeight: '600',
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2196F3',
        position: 'absolute',
        right: -5,
        top: 0,
    },
    expandedSection: {
        overflow: 'hidden',
        paddingHorizontal: 12,
    },
    fullContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        marginBottom: 12,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginLeft: 8,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#555',
    },
});

export default NotificationCard;
