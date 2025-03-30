import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { shippingStyles as styles } from './styles';

const ShippingInfo = ({ order, isAdmin, onTrackPackage }) => {
    // Prepare shipping address display
    const addressDisplay = () => {
        if (isAdmin) {
            return (
                <>
                    <Text style={styles.addressText}>{order.shipping?.address}</Text>
                </>
            );
        } else {
            const address = order.shippingAddress || {};
            return (
                <>
                    <Text style={styles.addressName}>{address.fullName}</Text>
                    <Text style={styles.addressText}>{address.street}</Text>
                    <Text style={styles.addressText}>
                        {address.city}, {address.state} {address.zipCode}
                    </Text>
                    <Text style={styles.addressText}>{address.country}</Text>
                </>
            );
        }
    };

    // Render tracking info based on status
    const renderTrackingInfo = () => {
        const showTracking = (order.status === 'Shipped' || order.status === 'shipped' ||
            order.status === 'Processing' || order.status === 'processing');

        if (!showTracking) return null;

        return (
            <View style={styles.trackingContainer}>
                <Text style={styles.trackingTitle}>Tracking Information</Text>
                <Text style={styles.trackingNumber}>
                    Tracking #: {order.trackingNumber || order.shipping?.tracking_number || 'Not available yet'}
                </Text>
                <Text style={styles.deliveryDate}>
                    Estimated delivery: {order.estimatedDelivery || order.shipping?.expected_delivery || 'Not available yet'}
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
                {addressDisplay()}
                {renderTrackingInfo()}
            </Card.Content>
        </Card>
    );
};

export default ShippingInfo;
