import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetOrderByIdQuery } from '~/states/api/orders';
import { formatDate } from '~/utils/formatters';

export default function OrderSuccess({ route, navigation }) {
    const { orderId, order: orderFromParams } = route.params || {};
    const { data, isLoading, error } = !orderFromParams ?
        useGetOrderByIdQuery(orderId) :
        { data: null, isLoading: false, error: null };
    const orderData = orderFromParams || (data?.resource || data);

    const handleContinueShopping = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'DefaultNav' }],
        });
    };

    const handleViewOrders = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Orders' }],
        });
    };

    const formatPaymentMethod = (method) => {
        switch (method) {
            case 'cod': return 'Cash on Delivery';
            case 'paypal': return 'PayPal';
            case 'stripe': return 'Credit Card';
            default: return method;
        }
    };

    const formatShippingMethod = (method) => {
        switch (method) {
            case 'std': return 'Standard';
            case 'exp': return 'Express';
            case 'smd': return 'Same Day';
            default: return method;
        }
    };

    const renderOrderItem = ({ item, index }) => {
        const quantity = orderData?.quantities?.[index]?.[item._id] || 1;
        const itemTotal = item.price * quantity;

        return (
            <View style={styles.orderItem}>
                <View style={styles.orderItemHeader}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemPrice}>
                        {process.env.EXPO_PUBLIC_APP_CURRENCY} {itemTotal.toFixed(2)}
                    </Text>
                </View>
                <Text style={styles.orderItemQuantity}>
                    {quantity} x {process.env.EXPO_PUBLIC_APP_CURRENCY} {item.price.toFixed(2)}
                </Text>
            </View>
        );
    };

    const renderOrderItems = () => {
        if (!orderData?.products || orderData.products.length === 0) {
            return (
                <View style={styles.emptyProducts}>
                    <Text style={styles.emptyProductsText}>
                        {orderData?.quantities && orderData.quantities.length > 0
                            ? `This order contains ${orderData.quantities.length} item(s)`
                            : 'No items in this order'}
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={orderData.products}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id?.toString()}
                scrollEnabled={false}
            />
        );
    };

    const safelyRenderStatus = () => {
        if (!orderData?.status) return 'PENDING';
        return orderData.status.toUpperCase();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                </View>

                <Text style={styles.title}>Order Successful!</Text>

                <Text style={styles.message}>
                    Your order has been placed successfully and is being processed.
                </Text>

                {orderId && (
                    <View style={styles.orderIdContainer}>
                        <Text style={styles.orderIdLabel}>Order ID:</Text>
                        <Text style={styles.orderId}>{orderId}</Text>
                    </View>
                )}

                {!orderFromParams && isLoading ? (
                    <Text style={styles.loadingText}>Loading order details...</Text>
                ) : !orderFromParams && error ? (
                    <Text style={styles.errorText}>Could not load order details</Text>
                ) : orderData ? (
                    <View style={styles.receiptContainer}>
                        <Text style={styles.receiptTitle}>Order Receipt</Text>

                        <View style={styles.receiptSection}>
                            <Text style={styles.receiptSectionTitle}>Order Information</Text>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Date:</Text>
                                <Text style={styles.receiptValue}>
                                    {formatDate(orderData.createdAt)}
                                </Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Status:</Text>
                                <Text style={[styles.receiptValue, styles.statusValue]}>
                                    {safelyRenderStatus()}
                                </Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Notes:</Text>
                                <Text style={styles.receiptValue}>{orderData.notes || 'No notes'}</Text>
                            </View>
                        </View>

                        <View style={styles.receiptSection}>
                            <Text style={styles.receiptSectionTitle}>Payment & Shipping</Text>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Payment Method:</Text>
                                <Text style={styles.receiptValue}>
                                    {formatPaymentMethod(orderData.payment?.method)}
                                </Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Payment Status:</Text>
                                <Text style={styles.receiptValue}>
                                    {orderData.payment?.status ? orderData.payment.status.toUpperCase() : 'PENDING'}
                                </Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Shipping Method:</Text>
                                <Text style={styles.receiptValue}>
                                    {formatShippingMethod(orderData.shipping?.method)}
                                </Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Delivery Address:</Text>
                                <Text style={styles.receiptValue}>
                                    {orderData.shipping?.address || 'No address provided'}
                                </Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Est. Delivery:</Text>
                                <Text style={styles.receiptValue}>
                                    {orderData.shipping?.expected_ship_date ? formatDate(orderData.shipping.expected_ship_date) : 'No date available'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.receiptSection}>
                            <Text style={styles.receiptSectionTitle}>Order Items</Text>
                            {renderOrderItems()}
                        </View>

                        <View style={styles.receiptSection}>
                            <Text style={styles.receiptSectionTitle}>Order Summary</Text>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Subtotal:</Text>
                                <Text style={styles.receiptValue}>
                                    {process.env.EXPO_PUBLIC_APP_CURRENCY} {(orderData.subTotal || 0).toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Shipping Fee:</Text>
                                <Text style={styles.receiptValue}>
                                    {process.env.EXPO_PUBLIC_APP_CURRENCY} {(orderData.shipping?.fee || 0).toFixed(2)}
                                </Text>
                            </View>
                            <View style={[styles.receiptRow, styles.totalRow]}>
                                <Text style={[styles.receiptLabel, styles.totalLabel]}>Total:</Text>
                                <Text style={[styles.receiptValue, styles.totalValue]}>
                                    {process.env.EXPO_PUBLIC_APP_CURRENCY} {(orderData.total || 0).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                ) : null}

                <Text style={styles.thankYou}>
                    Thank you for shopping with us!
                </Text>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinueShopping}
                    >
                        <Text style={styles.continueButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.viewOrdersButton}
                        onPress={handleViewOrders}
                    >
                        <Text style={styles.viewOrdersButtonText}>View My Orders</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        padding: 20,
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212121',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#616161',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    orderIdContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        padding: 12,
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        width: '100%',
        justifyContent: 'center',
    },
    orderIdLabel: {
        fontSize: 16,
        color: '#424242',
        fontWeight: '600',
        marginRight: 8,
    },
    orderId: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 14,
        color: '#757575',
        marginVertical: 12,
    },
    errorText: {
        fontSize: 14,
        color: '#F44336',
        marginVertical: 12,
    },
    thankYou: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2196F3',
        marginBottom: 24,
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
    },
    continueButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewOrdersButton: {
        backgroundColor: '#E3F2FD',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewOrdersButtonText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    receiptContainer: {
        width: '100%',
        marginBottom: 20,
    },
    receiptTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
        textAlign: 'center',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    receiptSection: {
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    receiptSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#424242',
        marginBottom: 8,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    receiptLabel: {
        fontSize: 14,
        color: '#757575',
    },
    receiptValue: {
        fontSize: 14,
        color: '#212121',
        fontWeight: '500',
        textAlign: 'right',
        flex: 1,
        marginLeft: 8,
    },
    statusValue: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    orderItem: {
        marginBottom: 8,
    },
    orderItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderItemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#212121',
        flex: 1,
    },
    orderItemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#212121',
    },
    orderItemQuantity: {
        fontSize: 12,
        color: '#757575',
    },
    emptyProducts: {
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginVertical: 8,
    },
    emptyProductsText: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
    },
});
