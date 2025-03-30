import React from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { summaryStyles as styles } from './styles';

const OrderSummary = ({ order, isAdmin, formatCurrency }) => {
    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>
                        {formatCurrency(isAdmin ? order.subTotal : order.totalAmount)}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>
                        {formatCurrency(isAdmin ? (order.shipping?.fee || 0) : 0)}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tax</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(0)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                        {formatCurrency(order.total || order.totalAmount)}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

export default OrderSummary;
