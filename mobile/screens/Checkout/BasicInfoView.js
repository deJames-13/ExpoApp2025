import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '~/hooks/useAuth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateBasicInfo } from '~/states/slices/checkout';
import LoadingScreen from '~/screens/LoadingScreen';

const CheckoutSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('First name is required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Last name is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    address: Yup.string()
        .required('Address is required'),
    city: Yup.string()
        .required('City is required'),
    state: Yup.string()
        .required('State is required'),
    zipCode: Yup.string()
        .required('Zip code is required'),
    country: Yup.string()
        .required('Country is required'),
});

export default function BasicInfoView({ navigation, checkoutData, updateCheckoutData }) {
    const dispatch = useDispatch();
    const { currentUser, isAuthenticated, isLoading } = useAuth();

    // If auth is in loading state, show the loading screen
    if (isLoading) {
        return <LoadingScreen />;
    }

    const getInitialValues = () => {
        const userInfo = currentUser?.info || {};
        return {
            firstName: checkoutData.userInfo.firstName || userInfo.first_name || '',
            lastName: checkoutData.userInfo.lastName || userInfo.last_name || '',
            email: checkoutData.userInfo.email || currentUser?.email || '',
            phone: checkoutData.userInfo.phone || userInfo.contact || '',
            address: checkoutData.shippingAddress.address || userInfo.address || '',
            city: checkoutData.shippingAddress.city || userInfo.city || '',
            state: checkoutData.shippingAddress.state || userInfo.region || '',
            zipCode: checkoutData.shippingAddress.zipCode || userInfo.zip_code || '',
            country: checkoutData.shippingAddress.country || userInfo.country || 'Philippines',
        };
    };

    const handleSubmit = (values) => {
        updateCheckoutData('userInfo', {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
        });

        updateCheckoutData('shippingAddress', {
            address: values.address,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            country: values.country,
        });
        dispatch(updateBasicInfo({
            userInfo: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
            },
            shippingAddress: {
                address: values.address,
                city: values.city,
                state: values.state,
                zipCode: values.zipCode,
                country: values.country,
            }
        }));

        navigation.navigate('Payment');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.stepIndicator}>
                <View style={styles.stepActive}>
                    <Text style={styles.stepActiveText}>1</Text>
                </View>
                <View style={styles.stepLine}></View>
                <View style={styles.step}>
                    <Text style={styles.stepText}>2</Text>
                </View>
                <View style={styles.stepLine}></View>
                <View style={styles.step}>
                    <Text style={styles.stepText}>3</Text>
                </View>
            </View>

            <Formik
                initialValues={getInitialValues()}
                validationSchema={CheckoutSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
                    <>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                style={[styles.input, touched.firstName && errors.firstName && styles.inputError]}
                                value={values.firstName}
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                placeholder="Enter your first name"
                                placeholderTextColor="#999"
                            />
                            {touched.firstName && errors.firstName && (
                                <Text style={styles.errorText}>{errors.firstName}</Text>
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                style={[styles.input, touched.lastName && errors.lastName && styles.inputError]}
                                value={values.lastName}
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                placeholder="Enter your last name"
                                placeholderTextColor="#999"
                            />
                            {touched.lastName && errors.lastName && (
                                <Text style={styles.errorText}>{errors.lastName}</Text>
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={[styles.input, touched.email && errors.email && styles.inputError]}
                                value={values.email}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {touched.email && errors.email && (
                                <Text style={styles.errorText}>{errors.email}</Text>
                            )}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={[styles.input, touched.phone && errors.phone && styles.inputError]}
                                value={values.phone}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                            />
                            {touched.phone && errors.phone && (
                                <Text style={styles.errorText}>{errors.phone}</Text>
                            )}
                        </View>

                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Address</Text>
                            <TextInput
                                style={[styles.input, touched.address && errors.address && styles.inputError]}
                                value={values.address}
                                onChangeText={handleChange('address')}
                                onBlur={handleBlur('address')}
                                placeholder="Enter your street address"
                                placeholderTextColor="#999"
                            />
                            {touched.address && errors.address && (
                                <Text style={styles.errorText}>{errors.address}</Text>
                            )}
                        </View>

                        <View style={styles.rowFields}>
                            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>City</Text>
                                <TextInput
                                    style={[styles.input, touched.city && errors.city && styles.inputError]}
                                    value={values.city}
                                    onChangeText={handleChange('city')}
                                    onBlur={handleBlur('city')}
                                    placeholder="City"
                                    placeholderTextColor="#999"
                                />
                                {touched.city && errors.city && (
                                    <Text style={styles.errorText}>{errors.city}</Text>
                                )}
                            </View>

                            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>State</Text>
                                <TextInput
                                    style={[styles.input, touched.state && errors.state && styles.inputError]}
                                    value={values.state}
                                    onChangeText={handleChange('state')}
                                    onBlur={handleBlur('state')}
                                    placeholder="State"
                                    placeholderTextColor="#999"
                                />
                                {touched.state && errors.state && (
                                    <Text style={styles.errorText}>{errors.state}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.rowFields}>
                            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>Zip Code</Text>
                                <TextInput
                                    style={[styles.input, touched.zipCode && errors.zipCode && styles.inputError]}
                                    value={values.zipCode}
                                    onChangeText={handleChange('zipCode')}
                                    onBlur={handleBlur('zipCode')}
                                    placeholder="Zip Code"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                                {touched.zipCode && errors.zipCode && (
                                    <Text style={styles.errorText}>{errors.zipCode}</Text>
                                )}
                            </View>

                            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>Country</Text>
                                <TextInput
                                    style={[styles.input, touched.country && errors.country && styles.inputError]}
                                    value={values.country || 'Philippines'}
                                    onChangeText={handleChange('country')}
                                    onBlur={handleBlur('country')}
                                    placeholder="Country"
                                    placeholderTextColor="#999"
                                />
                                {touched.country && errors.country && (
                                    <Text style={styles.errorText}>{errors.country}</Text>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.nextButtonText}>Continue to Payment</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 16,
        color: '#212121',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: '#424242',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#f44336',
    },
    errorText: {
        color: '#f44336',
        fontSize: 12,
        marginTop: 4,
    },
    rowFields: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nextButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 24,
    },
    disabledButton: {
        backgroundColor: '#b0bec5',
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
