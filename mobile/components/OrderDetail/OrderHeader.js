import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { headerStyles as styles } from './styles';
import { getOrderStatusColor } from './themeUtils';

const OrderHeader = ({ order, isAdmin, onBack, getStatusColor = getOrderStatusColor }) => {
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
                        Order #{isAdmin ? order.id?.substring(0, 8) : order.orderNumber}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(order.status) }
                    ]}>
                        <Text style={styles.statusBadgeText}>{order.status}</Text>
                    </View>
                </View>
                <Text style={styles.orderDate}>
                    Placed on {isAdmin ? new Date(order.createdAt).toLocaleDateString() : order.date}
                </Text>
            </Card.Content>
        </Card>
    );
};

export default OrderHeader;
