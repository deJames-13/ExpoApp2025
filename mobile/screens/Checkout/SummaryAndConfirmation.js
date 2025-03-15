import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemListsView from './ItemListsView';

export default function SummaryAndConfirmation({ navigation, checkoutData }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const getShippingCost = () => {
        return checkoutData.shippingMethod === 'express' ? 19.99 : 9.99;
    };

    const calculateTotal = () => {
        return checkoutData.subtotal + getShippingCost() + checkoutData.tax;
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            Alert.alert(
                "Order Placed Successfully!",
                "Thank you for your purchase. Your order will be processed soon.",
                [{ text: "OK", onPress: () => navigation.navigate('Home') }]
            );
        }, 2000);
    };

    const getPaymentMethodIcon = () => {
        switch (checkoutData.paymentMethod) {
            case 'card':
                return 'card-outline';
            case 'paypal':
                return 'logo-paypal';
            case 'cash':
                return 'cash-outline';
            default:
                return 'wallet-outline';
        }
    };

    const getPaymentMethodName = () => {
        switch (checkoutData.paymentMethod) {
            case 'card':
                return 'Credit/Debit Card';
            case 'paypal':
                return 'PayPal';
            case 'cash':
                return 'Cash on Delivery';
            default:
                return 'Other';
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
                return <ItemListsView items={checkoutData.items} />;
            case 'orderTotal':
                return (
                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Order Total</Text>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${checkoutData.subtotal.toFixed(2)}</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Shipping</Text>
                            <Text style={styles.totalValue}>${getShippingCost().toFixed(2)}</Text>
                        </View>

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tax</Text>
                            <Text style={styles.totalValue}>${checkoutData.tax.toFixed(2)}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.grandTotalLabel}>Total</Text>
                            <Text style={styles.grandTotalValue}>${calculateTotal().toFixed(2)}</Text>
                        </View>
                    </View>
                );
            case 'buttons':
                return (
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Ionicons name="arrow-back" size={20} color="#2196F3" />
                            <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.placeOrderButton, isProcessing && styles.processingButton]}
                            onPress={handlePlaceOrder}
                            disabled={isProcessing}
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
        <FlatList
            data={sections}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.containerContent}
            showsVerticalScrollIndicator={true}
            removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"
        />
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
    }
});
