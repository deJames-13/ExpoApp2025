import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Divider, Button, Chip } from 'react-native-paper';
import { formatDate } from '~/utils/formatters';
import { adminColors } from '~/styles/adminTheme';
import { getStatusChipStyle } from '~/styles/adminThemeUtils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Order Status Workflow component
const OrderStatusWorkflow = ({ currentStatus, onStatusChange }) => {
    // Helper function to confirm status changes
    const confirmStatusChange = (newStatus) => {
        const statusLabels = {
            'pending': 'Pending',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };

        Alert.alert(
            `Confirm Status Change`,
            `Are you sure you want to change the order status to ${statusLabels[newStatus]}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => onStatusChange(newStatus) }
            ]
        );
    };

    // Helper function to confirm cancellation
    const confirmCancellation = () => {
        Alert.alert(
            'Confirm Cancellation',
            'Are you sure you want to cancel this order? This action cannot be undone.',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes, Cancel Order', style: 'destructive', onPress: () => onStatusChange('cancelled') }
            ]
        );
    };

    // Get style for each status button based on active state
    const getButtonStyle = (buttonStatus) => {
        const isActive = currentStatus === buttonStatus;
        return {
            backgroundColor: isActive ? adminColors.status[buttonStatus === 'cancelled' ? 'error' : 'success'] : 'transparent',
            borderColor: adminColors.status[buttonStatus === 'cancelled' ? 'error' : 'success'],
            marginHorizontal: 5,
        };
    };

    // Determine which buttons to show based on current status
    const renderStatusButtons = () => {
        switch (currentStatus) {
            case 'pending':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="contained"
                            icon="check-circle-outline"
                            onPress={() => confirmStatusChange('processing')}
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                        >
                            Process
                        </Button>
                        <View style={styles.cancelButtonContainer}>
                            <Button
                                mode="outlined"
                                icon="close-circle-outline"
                                onPress={confirmCancellation}
                                style={[styles.cancelButton]}
                                textColor={adminColors.status.error}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                );

            case 'processing':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="outlined"
                            icon="arrow-left"
                            onPress={() => confirmStatusChange('pending')}
                            style={styles.revertButton}
                            textColor={adminColors.text.secondary}
                        >
                            Revert
                        </Button>
                        <Button
                            mode="contained"
                            icon="truck-delivery-outline"
                            onPress={() => confirmStatusChange('shipped')}
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                        >
                            Ship
                        </Button>
                        <View style={styles.cancelButtonContainer}>
                            <Button
                                mode="outlined"
                                icon="close-circle-outline"
                                onPress={confirmCancellation}
                                style={[styles.cancelButton]}
                                textColor={adminColors.status.error}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                );

            case 'shipped':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="outlined"
                            icon="arrow-left"
                            onPress={() => confirmStatusChange('processing')}
                            style={styles.revertButton}
                            textColor={adminColors.text.secondary}
                        >
                            Revert
                        </Button>
                        <Button
                            mode="contained"
                            icon="check-circle"
                            onPress={() => confirmStatusChange('delivered')}
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                        >
                            Deliver
                        </Button>
                    </View>
                );

            case 'delivered':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="outlined"
                            icon="arrow-left"
                            onPress={() => confirmStatusChange('shipped')}
                            style={styles.revertButton}
                            textColor={adminColors.text.secondary}
                        >
                            Revert
                        </Button>
                    </View>
                );

            case 'cancelled':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Text style={styles.cancelledText}>
                            This order has been cancelled and cannot be processed further.
                        </Text>
                    </View>
                );

            default:
                return null;
        }
    };

    // Visualization of the workflow
    return (
        <View style={styles.statusWorkflowContainer}>
            <View style={styles.statusStepsContainer}>
                <View style={styles.statusStep}>
                    <View style={[
                        styles.statusDot,
                        {
                            backgroundColor: currentStatus === 'pending' ? adminColors.status.warning :
                                ['processing', 'shipped', 'delivered'].includes(currentStatus) ?
                                    adminColors.status.success : adminColors.text.light
                        }
                    ]} />
                    <Text style={[
                        styles.statusStepText,
                        currentStatus === 'pending' ? styles.activeStatusStep :
                            ['processing', 'shipped', 'delivered'].includes(currentStatus) ?
                                styles.completedStatusStep : styles.inactiveStatusStep
                    ]}>
                        Pending
                    </Text>
                </View>

                <View style={styles.statusConnector} />

                <View style={styles.statusStep}>
                    <View style={[
                        styles.statusDot,
                        {
                            backgroundColor: currentStatus === 'processing' ? adminColors.status.warning :
                                ['shipped', 'delivered'].includes(currentStatus) ?
                                    adminColors.status.success : adminColors.text.light
                        }
                    ]} />
                    <Text style={[
                        styles.statusStepText,
                        currentStatus === 'processing' ? styles.activeStatusStep :
                            ['shipped', 'delivered'].includes(currentStatus) ?
                                styles.completedStatusStep : styles.inactiveStatusStep
                    ]}>
                        Processing
                    </Text>
                </View>

                <View style={styles.statusConnector} />

                <View style={styles.statusStep}>
                    <View style={[
                        styles.statusDot,
                        {
                            backgroundColor: currentStatus === 'shipped' ? adminColors.status.warning :
                                ['delivered'].includes(currentStatus) ?
                                    adminColors.status.success : adminColors.text.light
                        }
                    ]} />
                    <Text style={[
                        styles.statusStepText,
                        currentStatus === 'shipped' ? styles.activeStatusStep :
                            ['delivered'].includes(currentStatus) ?
                                styles.completedStatusStep : styles.inactiveStatusStep
                    ]}>
                        Shipped
                    </Text>
                </View>

                <View style={styles.statusConnector} />

                <View style={styles.statusStep}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: currentStatus === 'delivered' ? adminColors.status.success : adminColors.text.light }
                    ]} />
                    <Text style={[
                        styles.statusStepText,
                        currentStatus === 'delivered' ? styles.activeStatusStep : styles.inactiveStatusStep
                    ]}>
                        Delivered
                    </Text>
                </View>
            </View>

            {currentStatus === 'cancelled' && (
                <View style={styles.cancelledBadge}>
                    <Icon name="cancel" size={20} color="#fff" />
                    <Text style={styles.cancelledBadgeText}>Cancelled</Text>
                </View>
            )}

            {renderStatusButtons()}
        </View>
    );
};

export function OrderForm({ order, onStatusChange, isModal = false }) {
    const [status, setStatus] = useState(order?.status || 'pending');

    useEffect(() => {
        if (order?.status) {
            setStatus(order.status);
        }
    }, [order?.status]);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        onStatusChange(order.id, newStatus);
    };

    // Get style for status chips
    const getStatusStyle = (status) => {
        const { text, chip } = getStatusChipStyle(status);
        return {
            chipStyle: {
                backgroundColor: chip.backgroundColor,
            },
            textStyle: {
                color: text.color,
                fontWeight: '600'
            }
        };
    };

    // Get payment status style
    const getPaymentStatusStyle = (status) => {
        const paymentStatusMap = {
            'paid': 'success',
            'pending': 'pending',
            'failed': 'cancelled'
        };

        return getStatusStyle(paymentStatusMap[status] || status);
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
                            style={[styles.statusChip, getStatusStyle(order?.status).chipStyle]}
                            textStyle={getStatusStyle(order?.status).textStyle}
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

            {/* Order Status Flow */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Order Status</Title>
                    <OrderStatusWorkflow
                        currentStatus={status}
                        onStatusChange={handleStatusChange}
                    />
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
                            style={[styles.statusChip, getPaymentStatusStyle(order?.payment?.status).chipStyle]}
                            textStyle={getPaymentStatusStyle(order?.payment?.status).textStyle}
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
            <Divider style={styles.itemDivider} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: adminColors.background,
    },
    fullPageContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: adminColors.cardBackground,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 16,
        color: adminColors.text.primary,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: adminColors.text.secondary,
        flex: 1,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        flex: 2,
        textAlign: 'right',
        color: adminColors.text.primary,
    },
    valueHighlight: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 2,
        textAlign: 'right',
        color: adminColors.primary,
    },
    statusChip: {
        height: 32,
        borderRadius: 14,
    },

    // Status workflow styles
    statusWorkflowContainer: {
        marginVertical: 10,
    },
    statusStepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    statusStep: {
        alignItems: 'center',
        width: 60,
    },
    statusDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginBottom: 5,
    },
    statusStepText: {
        fontSize: 12,
        textAlign: 'center',
    },
    activeStatusStep: {
        color: adminColors.status.warning,
        fontWeight: 'bold',
    },
    completedStatusStep: {
        color: adminColors.status.success,
        fontWeight: 'bold',
    },
    inactiveStatusStep: {
        color: adminColors.text.light,
    },
    statusConnector: {
        height: 2,
        backgroundColor: adminColors.text.light,
        flex: 1,
    },
    statusButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: adminColors.primary,
        // paddingHorizontal: 16,
        // margin: 4,
    },
    actionButtonLabel: {
        color: '#fff',
    },
    revertButton: {
        marginHorizontal: 5,
        borderColor: adminColors.text.secondary,
        margin: 4,
    },
    cancelButton: {
        borderColor: adminColors.status.error,
        margin: 4,
    },
    cancelledBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: adminColors.status.error,
        padding: 8,
        borderRadius: 4,
        marginBottom: 16,
    },
    cancelledBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    cancelledText: {
        color: adminColors.status.error,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    // Other existing styles
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
        color: adminColors.text.primary,
    },
    productQty: {
        flex: 1,
        textAlign: 'right',
        color: adminColors.text.secondary,
    },
    productPrice: {
        textAlign: 'right',
        marginBottom: 8,
        fontWeight: '500',
        color: adminColors.text.primary,
    },
    itemDivider: {
        marginVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: adminColors.text.secondary,
    },
    totalValue: {
        fontSize: 14,
        color: adminColors.text.primary,
    },
    grandTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: adminColors.primary,
    },
});