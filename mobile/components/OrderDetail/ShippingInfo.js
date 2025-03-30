import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { shippingStyles as styles } from './styles';

const ShippingInfo = ({ order, isAdmin, trackPackage, onTrackPackage }) => {
    // Format date for expected delivery
    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Not available';
        }
    };

    // Get shipping method name
    const getShippingMethodName = (method) => {
        const methods = {
            'std': 'Standard Shipping',
            'exp': 'Express Shipping',
            'smd': 'Same Day Delivery'
        };
        return methods[method] || method;
    };

    // Prepare shipping address display
    const addressDisplay = () => {
        if (order?.shipping?.address) {
            return (
                <>
                    <Text style={styles.addressName}>{order.user?.info?.first_name} {order.user?.info?.last_name}</Text>
                    <Text style={styles.addressText}>{order.shipping.address}</Text>
                </>
            );
        } else {
            return (
                <Text style={styles.addressText}>No address information available</Text>
            );
        }
    };

    // Render tracking info based on status
    const renderTrackingInfo = () => {
        const showTracking = (order.status === 'shipped' || order.status === 'delivered');

        if (!showTracking || !trackPackage) return null;

        return (
            <View style={styles.trackingContainer}>
                <Text style={styles.trackingTitle}>Tracking Information</Text>
                <Text style={styles.trackingNumber}>
                    Tracking #: {order.shipping?.tracking_number || 'Not available yet'}
                </Text>
                <Text style={styles.deliveryDate}>
                    Expected delivery: {formatDate(order.shipping?.expected_ship_date)}
                </Text>
                {!isAdmin && (
                    <TouchableOpacity
                        style={styles.trackButton}
                        onPress={onTrackPackage}
                    >
                        <Text style={styles.trackButtonText}>Track Package</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Shipping Information</Text>

                <View style={styles.methodRow}>
                    <Text style={styles.methodLabel}>Method:</Text>
                    <Text style={styles.methodValue}>
                        {getShippingMethodName(order?.shipping?.method)}
                    </Text>
                </View>

                <View style={styles.addressContainer}>
                    <Text style={styles.addressSectionTitle}>Shipping Address</Text>
                    {addressDisplay()}
                </View>

                {renderTrackingInfo()}
            </Card.Content>
        </Card>
    );
};

export default ShippingInfo;
