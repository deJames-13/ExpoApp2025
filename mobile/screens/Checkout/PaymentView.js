import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { updatePaymentInfo } from '~/states/slices/checkout';

// Shipping configuration matching the server
const shippingMethods = {
    std: { key: 'std', fee: 100, method: 'Standard', day: 7 },
    exp: { key: 'exp', fee: 200, method: 'Express', day: 3 },
    smd: { key: 'smd', fee: 300, method: 'Same Day', day: 1 },
};

const formatCurrency = (cents) => {
    return (cents).toFixed(2);
};

// Validation schema
const PaymentSchema = Yup.object().shape({
    shippingMethod: Yup.string()
        .oneOf(['std', 'exp', 'smd'], 'Please select a shipping method')
        .required('Shipping method is required'),
    paymentMethod: Yup.string()
        .oneOf(['cash', 'card', 'paypal'], 'Please select a payment method')
        .required('Payment method is required'),
});

export default function PaymentView({ navigation, checkoutData, updateCheckoutData }) {
    const dispatch = useDispatch();

    // Initial values
    const initialValues = {
        shippingMethod: checkoutData.shippingMethod || 'std',
        paymentMethod: checkoutData.paymentMethod || 'cash',
    };

    const handleSubmit = (values) => {
        // Update local component state
        updateCheckoutData('shippingMethod', values.shippingMethod);
        updateCheckoutData('paymentMethod', values.paymentMethod);

        // Update Redux state
        dispatch(updatePaymentInfo({
            shippingMethod: values.shippingMethod,
            paymentMethod: values.paymentMethod,
        }));

        // Navigate to summary
        navigation.navigate('Summary');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.stepIndicator}>
                <View style={styles.stepCompleted}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                </View>
                <View style={styles.stepLineActive}></View>
                <View style={styles.stepActive}>
                    <Text style={styles.stepActiveText}>2</Text>
                </View>
                <View style={styles.stepLine}></View>
                <View style={styles.step}>
                    <Text style={styles.stepText}>3</Text>
                </View>
            </View>

            <Formik
                initialValues={initialValues}
                validationSchema={PaymentSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, values, setFieldValue, isValid }) => (
                    <>
                        <Text style={styles.sectionTitle}>Shipping Method</Text>

                        <TouchableOpacity
                            style={[styles.methodCard, values.shippingMethod === 'std' && styles.selectedMethodCard]}
                            onPress={() => setFieldValue('shippingMethod', 'std')}
                        >
                            <View style={styles.methodCardLeft}>
                                <View style={[styles.radioButton, values.shippingMethod === 'std' && styles.radioButtonSelected]}>
                                    {values.shippingMethod === 'std' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodTitle}>Standard Shipping</Text>
                                    <Text style={styles.methodDescription}>Delivery in {shippingMethods.std.day} business days</Text>
                                </View>
                            </View>
                            <Text style={styles.methodPrice}>
                                {process.env.EXPO_PUBLIC_APP_CURRENCY} {formatCurrency(shippingMethods.std.fee)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.methodCard, values.shippingMethod === 'exp' && styles.selectedMethodCard]}
                            onPress={() => setFieldValue('shippingMethod', 'exp')}
                        >
                            <View style={styles.methodCardLeft}>
                                <View style={[styles.radioButton, values.shippingMethod === 'exp' && styles.radioButtonSelected]}>
                                    {values.shippingMethod === 'exp' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodTitle}>Express Shipping</Text>
                                    <Text style={styles.methodDescription}>Delivery in {shippingMethods.exp.day} business days</Text>
                                </View>
                            </View>
                            <Text style={styles.methodPrice}>
                                {process.env.EXPO_PUBLIC_APP_CURRENCY} {formatCurrency(shippingMethods.exp.fee)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.methodCard, values.shippingMethod === 'smd' && styles.selectedMethodCard]}
                            onPress={() => setFieldValue('shippingMethod', 'smd')}
                        >
                            <View style={styles.methodCardLeft}>
                                <View style={[styles.radioButton, values.shippingMethod === 'smd' && styles.radioButtonSelected]}>
                                    {values.shippingMethod === 'smd' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodTitle}>Same Day Shipping</Text>
                                    <Text style={styles.methodDescription}>Delivery in {shippingMethods.smd.day} business day</Text>
                                </View>
                            </View>
                            <Text style={styles.methodPrice}>
                                {process.env.EXPO_PUBLIC_APP_CURRENCY} {formatCurrency(shippingMethods.smd.fee)}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Payment Method</Text>

                        <TouchableOpacity
                            style={[styles.methodCard, values.paymentMethod === 'cash' && styles.selectedMethodCard]}
                            onPress={() => setFieldValue('paymentMethod', 'cash')}
                        >
                            <View style={styles.methodCardLeft}>
                                <View style={[styles.radioButton, values.paymentMethod === 'cash' && styles.radioButtonSelected]}>
                                    {values.paymentMethod === 'cash' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodTitle}>Cash on Delivery</Text>
                                    <Text style={styles.methodDescription}>Pay when you receive your items</Text>
                                </View>
                            </View>
                            <Ionicons name="cash-outline" size={24} color="#757575" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.methodCard, values.paymentMethod === 'card' && styles.selectedMethodCard]}
                            onPress={() => setFieldValue('paymentMethod', 'card')}
                        >
                            <View style={styles.methodCardLeft}>
                                <View style={[styles.radioButton, values.paymentMethod === 'card' && styles.radioButtonSelected]}>
                                    {values.paymentMethod === 'card' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                                    <Text style={styles.methodDescription}>Pay securely with your card</Text>
                                </View>
                            </View>
                            <View style={styles.cardIcons}>
                                <Image source={{ uri: 'https://via.placeholder.com/30' }} style={styles.cardIcon} />
                                <Image source={{ uri: 'https://via.placeholder.com/30' }} style={styles.cardIcon} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.methodCard, values.paymentMethod === 'paypal' && styles.selectedMethodCard]}
                            onPress={() => setFieldValue('paymentMethod', 'paypal')}
                        >
                            <View style={styles.methodCardLeft}>
                                <View style={[styles.radioButton, values.paymentMethod === 'paypal' && styles.radioButtonSelected]}>
                                    {values.paymentMethod === 'paypal' && <View style={styles.radioButtonInner} />}
                                </View>
                                <View style={styles.methodInfo}>
                                    <Text style={styles.methodTitle}>PayPal</Text>
                                    <Text style={styles.methodDescription}>Pay with your PayPal account</Text>
                                </View>
                            </View>
                            <Image source={{ uri: 'https://via.placeholder.com/30' }} style={styles.cardIcon} />
                        </TouchableOpacity>

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                                <Ionicons name="arrow-back" size={20} color="#2196F3" />
                                <Text style={styles.backButtonText}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.nextButton, !isValid && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={!isValid}
                            >
                                <Text style={styles.nextButtonText}>Review Order</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    step: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
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
    stepText: {
        color: '#757575',
        fontWeight: 'bold',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 16,
        color: '#212121',
    },
    methodCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    selectedMethodCard: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    methodCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    radioButtonSelected: {
        borderColor: '#2196F3',
    },
    radioButtonInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
    },
    methodInfo: {
        // flex: 1,
    },
    methodTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
    },
    methodDescription: {
        fontSize: 14,
        color: '#757575',
    },
    methodPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    cardIcons: {
        flexDirection: 'row',
    },
    cardIcon: {
        width: 30,
        height: 20,
        marginLeft: 4,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 24,
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
    nextButton: {
        flex: 1,
        marginLeft: 16,
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    disabledButton: {
        backgroundColor: '#b0bec5',
    },
});
