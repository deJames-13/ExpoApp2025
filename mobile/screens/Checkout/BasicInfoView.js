import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BasicInfoView({ navigation, checkoutData, updateCheckoutData }) {
    const [formData, setFormData] = useState({
        firstName: checkoutData.userInfo.firstName || '',
        lastName: checkoutData.userInfo.lastName || '',
        email: checkoutData.userInfo.email || '',
        phone: checkoutData.userInfo.phone || '',
        address: checkoutData.shippingAddress.address || '',
        city: checkoutData.shippingAddress.city || '',
        state: checkoutData.shippingAddress.state || '',
        zipCode: checkoutData.shippingAddress.zipCode || '',
        country: checkoutData.shippingAddress.country || '',
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        // Save form data to checkout data
        updateCheckoutData('userInfo', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
        });

        updateCheckoutData('shippingAddress', {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
        });

        // Navigate to payment step
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

            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.formGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                    placeholder="Enter your first name"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                    placeholder="Enter your last name"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => handleChange('phone', text)}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                />
            </View>

            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={formData.address}
                    onChangeText={(text) => handleChange('address', text)}
                    placeholder="Enter your street address"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.rowFields}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.city}
                        onChangeText={(text) => handleChange('city', text)}
                        placeholder="City"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.state}
                        onChangeText={(text) => handleChange('state', text)}
                        placeholder="State"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <View style={styles.rowFields}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Zip Code</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.zipCode}
                        onChangeText={(text) => handleChange('zipCode', text)}
                        placeholder="Zip Code"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Country</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.country}
                        onChangeText={(text) => handleChange('country', text)}
                        placeholder="Country"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
                <Text style={styles.nextButtonText}>Continue to Payment</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
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
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
