import React from 'react';
import { View, Text } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { paymentStyles as styles } from './styles';
import { getOrderStatusColor } from './themeUtils';

const PaymentInfo = ({ order, isAdmin, getStatusColor = getOrderStatusColor }) => {
    // Prepare payment display
    const paymentDisplay = () => {
        if (isAdmin) {
            return (
                <>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Method:</Text>
                        <Text style={styles.summaryValue}>{order?.payment?.method}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Status:</Text>
                        <Chip
                            style={[styles.statusChip, { backgroundColor: getStatusColor(order?.payment?.status) + '20' }]}
                            textStyle={{ color: getStatusColor(order?.payment?.status), fontWeight: '500' }}
                        >
                            {order?.payment?.status}
                        </Chip>
                    </View>
                </>
            );
        } else {
            return (
                <Text style={styles.paymentText}>{order.paymentMethod}</Text>
            );
        }
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                {paymentDisplay()}
            </Card.Content>
        </Card>
    );
};

export default PaymentInfo;
