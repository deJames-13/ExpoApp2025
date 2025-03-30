import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemListsView from './ItemListsView';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedItems, removeSelectedItems } from '~/states/slices/cart';
import { resetCheckout, selectShippingCost, selectTax } from '~/states/slices/checkout';
import useAuth from '~/hooks/useAuth';
import { useCreateOrderMutation } from '~/states/api/orders';
import Toast from 'react-native-toast-message';

export default function SummaryAndConfirmation({ navigation, checkoutData }) {
    const dispatch = useDispatch();
    const { currentUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Get selected items from cart and checkout details from Redux
    const selectedItemsObj = useSelector(selectSelectedItems);
    const shippingCost = useSelector(selectShippingCost);
    const tax = useSelector(selectTax);

    // Get cart items that are selected
    const selectedCartItems = checkoutData.items.filter(item => selectedItemsObj[item.id]);

    // Calculate the correct subtotal based on selected items
    const subtotal = useMemo(() => {
        return selectedCartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }, [selectedCartItems]);

    // Calculate the correct order total
    const orderTotal = useMemo(() => {
        return subtotal + shippingCost + tax;
    }, [subtotal, shippingCost, tax]);

    // Order API mutation hook
    const [createOrder, { isLoading, isError, error }] = useCreateOrderMutation();

    useEffect(() => {
        // If we have an API error, show it
        if (isError && error) {
            Toast.show({
                type: 'error',
                text1: 'Order Failed',
                text2: error.data?.message || 'Could not place your order. Please try again.',
            });
        }
    }, [isError, error]);

    const getShippingMethodKey = () => {
        // Map frontend shipping method names to backend keys
        return checkoutData.shippingMethod === 'express' ? 'exp' : 'std';
    };

    const getPaymentMethodKey = () => {
        // Map frontend payment method names to backend keys
        switch (checkoutData.paymentMethod) {
            case 'card': return 'stripe';
            case 'paypal': return 'paypal';
            case 'cash':
            default: return 'cod';
        }
    };

    const formatShippingAddress = () => {
        const { address, city, state, zipCode, country } = checkoutData.shippingAddress;
        return `${address}, ${city}, ${state} ${zipCode}, ${country}`;
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handlePlaceOrder = async () => {
        if (selectedCartItems.length === 0) {
            Alert.alert("No Items Selected", "Please select items to checkout.");
            return;
        }

        setIsProcessing(true);

        try {
            // Format the order data for the API
            const orderData = {
                userId: currentUser?._id,
                products: selectedCartItems.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity
                })),
                shipping: {
                    method: getShippingMethodKey(),
                    address: formatShippingAddress()
                },
                payment: {
                    method: getPaymentMethodKey(),
                    status: 'pending'
                },
                note: '',
                status: 'pending',
                subtotal: subtotal,
                total: orderTotal
            };

            // Make the API call
            const response = await createOrder(orderData).unwrap();
            setOrderSuccess(true);
            Toast.show({
                type: 'success',
                text1: 'Order Placed Successfully!',
                text2: `Order ID: ${response.id}`,
            });

            dispatch(removeSelectedItems());
            dispatch(resetCheckout());

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'OrderSuccess', params: {
                            orderId: response.resource.id,
                            order: response.resource
                        }
                    }],
                });
            }, 1500);

        } catch (err) {
            console.error('Order error:', err);
            Alert.alert(
                "Order Failed",
                err.message || "There was a problem placing your order. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const getPaymentMethodIcon = () => {
        switch (checkoutData.paymentMethod) {
            case 'card': return 'card-outline';
            case 'paypal': return 'logo-paypal';
            case 'cash': return 'cash-outline';
            default: return 'wallet-outline';
        }
    };

    const getPaymentMethodName = () => {
        switch (checkoutData.paymentMethod) {
            case 'card': return 'Credit/Debit Card';
            case 'paypal': return 'PayPal';
            case 'cash': return 'Cash on Delivery';
            default: return 'Other';
        }
    };

    const getShippingMethodName = () => {
        return checkoutData.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping';
    };

    // Create sections for FlatList
    const sections = [
        { id: 'header', type: 'header' },
        { id: 'customerInfo', type: 'customerInfo' },
        { id: 'deliveryPayment', type: 'deliveryPayment' },
        { id: 'orderItems', type: 'orderItems' },
        { id: 'orderTotal', type: 'orderTotal' },
        { id: 'buttons', type: 'buttons' },
        { id: 'disclaimer', type: 'disclaimer' },
    ];

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'header':
                return (
                    <>
                        <View style={styles.stepIndicator}>
                            <View style={styles.stepCompleted}>
                                <Ionicons name="checkmark" size={18} color="#fff" />
                            </View>
                            <View style={styles.stepLineActive}></View>
                            <View style={styles.stepCompleted}>
                                <Ionicons name="checkmark" size={18} color="#fff" />
                            </View>
                            <View style={styles.stepLineActive}></View>
                            <View style={styles.stepActive}>
                                <Text style={styles.stepActiveText}>3</Text>
                            </View>
                        </View>
                        <Text style={styles.pageTitle}>Order Summary</Text>
                    </>
                );
            case 'customerInfo':
                return (
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Customer Information</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('BasicInfo')}
                                style={styles.editButton}
                            >
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Name:</Text>
                            <Text style={styles.infoValue}>{checkoutData.userInfo.firstName} {checkoutData.userInfo.lastName}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoValue}>{checkoutData.userInfo.email}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Phone:</Text>
                            <Text style={styles.infoValue}>{checkoutData.userInfo.phone}</Text>
                        </View>

                        <View style={[styles.divider, { marginVertical: 12 }]} />

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Shipping Address:</Text>
                            <Text style={styles.infoValue}>
                                {checkoutData.shippingAddress.address}, {checkoutData.shippingAddress.city},
                                {"\n"}{checkoutData.shippingAddress.state} {checkoutData.shippingAddress.zipCode},
                                {"\n"}{checkoutData.shippingAddress.country}
                            </Text>
                        </View>
                    </View>
                );
            case 'deliveryPayment':
                return (
                    <View style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Delivery & Payment</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Payment')}
                                style={styles.editButton}
                            >
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Delivery Method:</Text>
                            <Text style={styles.infoValue}>{getShippingMethodName()}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Payment Method:</Text>
                            <View style={styles.paymentMethodContainer}>
                                <Ionicons name={getPaymentMethodIcon()} size={20} color="#2196F3" style={styles.paymentIcon} />
                                <Text style={styles.infoValue}>{getPaymentMethodName()}</Text>
                            </View>
                        </View>
                    </View>
                );
            case 'orderItems':
                return (
                    <>
                        <Text style={styles.selectedItemsHeader}>
                            {selectedCartItems.length} {selectedCartItems.length === 1 ? 'Item' : 'Items'} to Checkout
                        </Text>
                        <ItemListsView items={selectedCartItems} />
                    </>
                );
            case 'orderTotal':
                return (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Order Total</Text>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {subtotal.toFixed(2)}</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Shipping</Text>
                            <Text style={styles.totalValue}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {shippingCost.toFixed(2)}</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tax</Text>
                            <Text style={styles.totalValue}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {tax.toFixed(2)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalValue}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {orderTotal.toFixed(2)}</Text>
                        </View>
                    </View>
                );
            case 'buttons':
                return (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            disabled={isProcessing}
                        >
                            <Ionicons name="arrow-back" size={20} color="#2196F3" />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.placeOrderButton,
                                isProcessing && styles.processingButton,
                                selectedCartItems.length === 0 && styles.disabledButton
                            ]}
                            onPress={handlePlaceOrder}
                            disabled={isProcessing || selectedCartItems.length === 0}
                        >
                            {isProcessing ? (
                                <View style={styles.processingContent}>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text style={styles.placeOrderButtonText}>Processing...</Text>
                                </View>
                            ) : (
                                <Text style={styles.placeOrderButtonText}>Place Order</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );
            case 'disclaimer':
                return (
                    <View style={styles.disclaimer}>
                        <Text style={styles.disclaimerText}>
                            By placing your order, you agree to our Terms of Service and Privacy Policy.
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <FlatList
                data={sections}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.containerContent}
                showsVerticalScrollIndicator={true}
                removeClippedSubviews={false}
                keyboardShouldPersistTaps="handled"
            />
            <Toast />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    containerContent: {
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    stepActive: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCompleted: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepActiveText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 5,
    },
    stepLineActive: {
        flex: 1,
        height: 2,
        backgroundColor: '#4CAF50',
        marginHorizontal: 5,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 16,
        color: '#212121',
        textAlign: 'center',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
    },
    editButton: {
        padding: 6,
    },
    editButtonText: {
        fontSize: 14,
        color: '#2196F3',
        fontWeight: '500',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        width: 120,
        fontSize: 14,
        color: '#757575',
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#212121',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    paymentMethodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        marginRight: 6,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: '#757575',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#212121',
    },
    grandTotalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212121',
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2196F3',
        backgroundColor: '#fff',
    },
    backButtonText: {
        marginLeft: 8,
        color: '#2196F3',
        fontSize: 16,
        fontWeight: '500',
    },
    placeOrderButton: {
        flex: 1,
        marginLeft: 16,
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    processingButton: {
        backgroundColor: '#81C784',
    },
    processingContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeOrderButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    disclaimer: {
        marginBottom: 24,
        padding: 16,
    },
    disclaimerText: {
        fontSize: 12,
        color: '#757575',
        textAlign: 'center',
    },
    selectedItemsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#212121',
    },
    disabledButton: {
        backgroundColor: '#b0bec5',
    },
});
