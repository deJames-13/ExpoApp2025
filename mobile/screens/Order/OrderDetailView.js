import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import OrderDetail from '~/components/OrderDetail';

const OrderDetailView = ({ route, navigation }) => {
    const { orderId } = route.params;
    const [order, setOrder] = useState(null);

    // Mock fetch order data
    useEffect(() => {
        // Simulate API call
        const fetchedOrder = {
            id: orderId,
            orderNumber: '3456-7890',
            date: 'May 15, 2023',
            status: 'Shipped',
            totalAmount: 429.97,
            shippingAddress: {
                fullName: 'John Doe',
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
            },
            paymentMethod: 'Visa **** 1234',
            items: [
                {
                    id: '1',
                    name: 'Ray-Ban Aviator',
                    price: 149.99,
                    quantity: 1,
                },
                {
                    id: '2',
                    name: 'Oakley Holbrook',
                    price: 129.99,
                    quantity: 2,
                }
            ],
            trackingNumber: 'TN-12345678901',
            estimatedDelivery: 'May 22, 2023'
        };

        setOrder(fetchedOrder);
    }, [orderId]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleTrackPackage = () => {
        // Implementation for tracking package
        Alert.alert('Track Package', 'Redirecting to carrier website...');
    };

    const handleContactSupport = () => {
        // Implementation for contacting support
        Alert.alert('Contact Support', 'Opening support chat...');
    };

    const handleCancelOrder = () => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel Order',
                    style: 'destructive',
                    onPress: () => {
                        // Implementation for cancelling order
                        Alert.alert('Order Cancelled', 'Your order has been cancelled successfully');
                        // Update the order status locally
                        setOrder(prev => ({ ...prev, status: 'Cancelled' }));
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <OrderDetail
                order={order}
                isAdmin={false}
                onBack={handleBack}
                onTrackPackage={handleTrackPackage}
                onContactSupport={handleContactSupport}
                onCancelOrder={handleCancelOrder}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

export default OrderDetailView;
