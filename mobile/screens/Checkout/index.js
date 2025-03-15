import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BasicInfoView from './BasicInfoView';
import PaymentView from './PaymentView';
import SummaryAndConfirmation from './SummaryAndConfirmation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const Stack = createStackNavigator();

export function CheckoutScreen() {
    // This state will store all checkout information across screens
    const [checkoutData, setCheckoutData] = useState({
        userInfo: {},
        shippingAddress: {},
        paymentMethod: '',
        shippingMethod: '',
        items: [
            // Sample items
            { id: 1, name: 'Premium Sunglasses', price: 129.99, quantity: 1, status: 'In Stock' },
            { id: 2, name: 'Reading Glasses', price: 59.99, quantity: 2, status: 'In Stock' }
        ],
        subtotal: 249.97,
        shipping: 9.99,
        tax: 20.00
    });

    const updateCheckoutData = (key, value) => {
        setCheckoutData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Checkout</Text>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right'
                }}
                initialRouteName="BasicInfo"
            >
                <Stack.Screen name="BasicInfo">
                    {props => (
                        <BasicInfoView
                            {...props}
                            checkoutData={checkoutData}
                            updateCheckoutData={updateCheckoutData}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Payment">
                    {props => (
                        <PaymentView
                            {...props}
                            checkoutData={checkoutData}
                            updateCheckoutData={updateCheckoutData}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Summary">
                    {props => (
                        <SummaryAndConfirmation
                            {...props}
                            checkoutData={checkoutData}
                            updateCheckoutData={updateCheckoutData}
                        />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    }
});