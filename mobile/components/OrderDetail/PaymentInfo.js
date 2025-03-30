import React from 'react';
import { View, Text } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { paymentStyles as styles } from './styles';
import { getOrderStatusColor } from './themeUtils';

const PaymentInfo = ({ order, isAdmin, getStatusColor = getOrderStatusColor }) => {
    // Get payment method name
    const getPaymentMethodName = (method) => {
        const methods = {
            'cod': 'Cash on Delivery',
            'paypal': 'PayPal',
            'stripe': 'Credit Card'
        };
        return methods[method] || method;
    };

    // Get payment status name
    const getPaymentStatusName = (status) => {
        const statuses = {
            'pending': 'Pending',
            'paid': 'Paid',
            'failed': 'Failed'
        };
        return statuses[status] || status;
    };

    // Get payment status color
    const getPaymentStatusColor = (status) => {
        const colors = {
            'pending': '#FFA000', // amber
            'paid': '#4CAF50',    // green
            'failed': '#F44336'   // red
        };
        return colors[status] || '#9E9E9E'; // gray default
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Payment Information</Text>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Method:</Text>
                    <Text style={styles.paymentText}>
                        {getPaymentMethodName(order?.payment?.method)}
                    </Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Status:</Text>
                    <Chip
                        style={[
                            styles.statusChip,
                            { backgroundColor: getPaymentStatusColor(order?.payment?.status) + '20' }
                        ]}
                        textStyle={{
                            color: getPaymentStatusColor(order?.payment?.status),
                            fontWeight: '500'
                        }}
                    >
                        {getPaymentStatusName(order?.payment?.status)}
                    </Chip>
                </View>
            </Card.Content>
        </Card>
    );
};

export default PaymentInfo;
