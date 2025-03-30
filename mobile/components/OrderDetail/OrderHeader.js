import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { headerStyles as styles } from './styles';
import { getOrderStatusColor } from './themeUtils';

const OrderHeader = ({ order, isAdmin, onBack, getStatusColor = getOrderStatusColor }) => {
    // Format the order date for user view
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                {!isAdmin && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBack}
                    >
                        <Text style={styles.backButtonText}>← Back to Orders</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>
                        Order #{isAdmin ? (order.id?.substring(0, 8) || '') : (order.id?.substring(0, 8) || order.orderNumber || '')}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(order.status) }
                    ]}>
                        <Text style={styles.statusBadgeText}>
                            {(order.status || '').charAt(0).toUpperCase() + (order.status || '').slice(1)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.orderDate}>
                    Placed on {isAdmin ? formatDate(order.createdAt) : formatDate(order.createdAt || order.date)}
                </Text>
            </Card.Content>
        </Card>
    );
};

export default OrderHeader;
