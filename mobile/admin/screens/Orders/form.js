import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Divider, Button, Chip } from 'react-native-paper';
import { SelectField } from '~/components/ResourceForm/FormFields';
import { orderStatusOptions } from './form-config';
import { formatDate } from '~/utils/formatters';

export function OrderForm({ order, onStatusChange, isModal = false }) {
    const [status, setStatus] = useState(order?.status || 'pending');

    const handleSubmit = () => {
        onStatusChange(order.id, status);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            pending: '#FFA000',    // Amber
            processing: '#2196F3', // Blue
            shipped: '#8BC34A',    // Light Green
            delivered: '#4CAF50',  // Green
            cancelled: '#F44336',  // Red
        };
        return statusColors[status] || '#9E9E9E'; // Grey default
    };

    return (
        <ScrollView style={[styles.container, isModal ? {} : styles.fullPageContainer]}>
            {/* Order Summary Section */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Order Summary</Title>

                    <View style={styles.row}>
                        <Text style={styles.label}>Order Number:</Text>
                        <Text style={styles.value}>#{order?.orderNumber}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.value}>{formatDate(order?.createdAt)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Status:</Text>
                        <Chip
                            style={[styles.statusChip, { backgroundColor: getStatusColor(order?.status) + '20' }]}
                            textStyle={{ color: getStatusColor(order?.status) }}
                        >
                            {order?.status}
                        </Chip>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Customer:</Text>
                        <Text style={styles.value}>
                            {order?.customer?.info?.first_name} {order?.customer?.info?.last_name}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Total Amount:</Text>
                        <Text style={styles.valueHighlight}>${order?.totalAmount.toFixed(2)}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Payment Information */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Payment Information</Title>

                    <View style={styles.row}>
                        <Text style={styles.label}>Method:</Text>
                        <Text style={styles.value}>{order?.payment?.method}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Status:</Text>
                        <Chip
                            style={[styles.statusChip, {
                                backgroundColor: order?.payment?.status === 'paid' ? '#4CAF5020' : '#FFA00020'
                            }]}
                            textStyle={{
                                color: order?.payment?.status === 'paid' ? '#4CAF50' : '#FFA000'
                            }}
                        >
                            {order?.payment?.status}
                        </Chip>
                    </View>
                </Card.Content>
            </Card>

            {/* Shipping Information */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Shipping Information</Title>

                    <View style={styles.row}>
                        <Text style={styles.label}>Method:</Text>
                        <Text style={styles.value}>{order?.shipping?.method}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Address:</Text>
                        <Text style={styles.value}>{order?.shipping?.address}</Text>
                    </View>

                    {order?.shipping?.expected_ship_date && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Expected Ship Date:</Text>
                            <Text style={styles.value}>{formatDate(order?.shipping?.expected_ship_date)}</Text>
                        </View>
                    )}

                    {order?.shipping?.shipped_date && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Shipped Date:</Text>
                            <Text style={styles.value}>{formatDate(order?.shipping?.shipped_date)}</Text>
                        </View>
                    )}

                    <View style={styles.row}>
                        <Text style={styles.label}>Shipping Fee:</Text>
                        <Text style={styles.value}>${order?.shipping?.fee.toFixed(2)}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Products */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Products</Title>

                    {order?.products?.map((item, index) => (
                        <View key={index} style={styles.productItem}>
                            <View style={styles.productRow}>
                                <Text style={styles.productName}>{item.product.name}</Text>
                                <Text style={styles.productQty}>x{item.quantity}</Text>
                            </View>
                            <Text style={styles.productPrice}>
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </Text>
                            <Divider style={index < order.products.length - 1 ? styles.itemDivider : {}} />
                        </View>
                    ))}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal:</Text>
                        <Text style={styles.totalValue}>
                            ${order?.subtotal?.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Shipping:</Text>
                        <Text style={styles.totalValue}>
                            ${order?.shipping?.fee.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.grandTotal}>
                            ${order?.totalAmount.toFixed(2)}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Update Status */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Update Status</Title>

                    <SelectField
                        field="status"
                        label="Order Status"
                        value={status}
                        setFieldValue={(field, value) => setStatus(value)}
                        options={orderStatusOptions}
                        errors={{}}
                        touched={{}}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.updateButton}
                    >
                        Update Order Status
                    </Button>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fullPageContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    value: {
        fontSize: 14,
        flex: 2,
        textAlign: 'right',
    },
    valueHighlight: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 2,
        textAlign: 'right',
    },
    statusChip: {
        height: 28,
    },
    productItem: {
        marginBottom: 8,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    productName: {
        flex: 3,
    },
    productQty: {
        flex: 1,
        textAlign: 'right',
    },
    productPrice: {
        textAlign: 'right',
        marginBottom: 8,
    },
    itemDivider: {
        marginVertical: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 14,
    },
    grandTotal: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    updateButton: {
        marginTop: 16,
    },
});
