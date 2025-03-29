import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';

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

    if (!order) {
        return <View style={styles.loading}><Text>Loading...</Text></View>;
    }

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Image
                source={{ uri: process.env.EXPO_PUBLIC_APP_LOGO }}
                style={styles.itemImage}
                resizeMode="cover"
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
                <Text style={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                </Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>← Back to Orders</Text>
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>Order #{order.orderNumber}</Text>
                    <Text style={[styles.statusBadge,
                    {
                        backgroundColor: order.status === 'Delivered' ? '#4CAF50' :
                            order.status === 'Shipped' ? '#2196F3' : '#FF9800'
                    }
                    ]}>
                        {order.status}
                    </Text>
                </View>
                <Text style={styles.orderDate}>Placed on {order.date}</Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Order Items</Text>
                <FlatList
                    data={order.items}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>
                        ${order.totalAmount.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>$0.00</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>$0.00</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                        ${order.totalAmount.toFixed(2)}
                    </Text>
                </View>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Shipping Information</Text>
                <Text style={styles.addressName}>{order.shippingAddress.fullName}</Text>
                <Text style={styles.addressText}>{order.shippingAddress.street}</Text>
                <Text style={styles.addressText}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Text>
                <Text style={styles.addressText}>{order.shippingAddress.country}</Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <Text style={styles.paymentText}>{order.paymentMethod}</Text>
            </View>

            {(order.status === 'Shipped' || order.status === 'Processing') && (
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Tracking Information</Text>
                    <Text style={styles.trackingNumber}>
                        Tracking #: {order.trackingNumber}
                    </Text>
                    <Text style={styles.deliveryDate}>
                        Estimated delivery: {order.estimatedDelivery}
                    </Text>
                    <TouchableOpacity style={styles.trackButton}>
                        <Text style={styles.trackButtonText}>Track Package</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.supportButton}>
                    <Text style={styles.supportButtonText}>Contact Support</Text>
                </TouchableOpacity>
                {order.status !== 'Delivered' && (
                    <TouchableOpacity style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        padding: 16,
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
    },
    headerContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        color: 'white',
        fontSize: 14,
    },
    orderDate: {
        marginTop: 8,
        color: '#757575',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 12,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#757575',
    },
    summaryValue: {
        fontSize: 16,
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    addressName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 16,
        lineHeight: 22,
    },
    paymentText: {
        fontSize: 16,
    },
    trackingNumber: {
        fontSize: 16,
        marginBottom: 4,
    },
    deliveryDate: {
        fontSize: 16,
        marginBottom: 16,
    },
    trackButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    trackButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actionsContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 12,
        marginBottom: 24,
        borderRadius: 8,
        marginHorizontal: 8,
        flexDirection: 'row',
    },
    supportButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    supportButtonText: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#ffebee',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#F44336',
        fontWeight: 'bold',
    },
});

export default OrderDetailView;
