import React from 'react';
import { Text, View } from 'react-native';
import { getActionIcon } from '~/utils/iconHelper';

// Format date for display
const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Get status color based on status
const getStatusColor = (status) => {
    const colors = {
        pending: '#FFA000',     // Amber
        processing: '#2196F3',  // Blue
        shipped: '#8BC34A',     // Light Green
        delivered: '#4CAF50',   // Green
        cancelled: '#F44336',   // Red
    };
    return colors[status] || '#9E9E9E'; // Grey default
};

// Get payment status color
const getPaymentStatusColor = (status) => {
    const colors = {
        paid: '#4CAF50',      // Green
        pending: '#FFA000',   // Amber
        failed: '#F44336',    // Red
    };
    return colors[status] || '#9E9E9E'; // Grey default
};

/**
 * Table columns configuration with responsive priorities:
 * - Priority 1: Always visible (for small screens)
 * - Priority 2: Visible on medium screens
 * - Priority 3: Visible on large screens only
 */
export const orderTableColumns = [
    {
        id: 'customer',
        title: 'Customer',
        field: 'user.username',
        sortable: true,
        flex: 2,
        priority: 1, // High priority - always show
        render: (order) => (
            <View>
                <Text>{order.user?.info?.first_name || ''} {order.user?.info?.last_name || ''}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{order.user?.email || order.user?.username}</Text>
            </View>
        ),
    },
    {
        id: 'amount',
        title: 'Amount',
        field: 'total',
        sortable: true,
        textAlign: 'right',
        flex: 1,
        priority: 1, // High priority - always show
        render: (order) => (
            <Text style={{ fontWeight: 'bold' }}>
                ${parseFloat(order.total || 0).toFixed(2)}
            </Text>
        ),
    },
    {
        id: 'status',
        title: 'Status',
        field: 'status',
        sortable: true,
        flex: 1.5,
        priority: 1, // High priority - always show
        render: (order) => (
            <View style={{
                backgroundColor: getStatusColor(order.status) + '20',
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 4,
                alignSelf: 'flex-start'
            }}>
                <Text style={{
                    color: getStatusColor(order.status),
                    fontWeight: '500',
                    textTransform: 'capitalize'
                }}>
                    {order.status}
                </Text>
            </View>
        ),
    },
    {
        id: 'order',
        title: 'Order #',
        field: 'id',
        sortable: true,
        flex: 1.5,
        priority: 2, // Medium priority - show on medium screens
        render: (order) => (
            <View>
                <Text style={{ fontWeight: 'bold' }}>{order.id?.substring(0, 8)}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{formatDate(order.createdAt)}</Text>
            </View>
        ),
    },
    {
        id: 'payment',
        title: 'Payment',
        field: 'payment.status',
        sortable: true,
        flex: 1.5,
        priority: 3, // Low priority - show only on large screens
        render: (order) => (
            <View>
                <Text style={{
                    color: getPaymentStatusColor(order.payment?.status),
                    fontWeight: '500',
                    textTransform: 'capitalize'
                }}>
                    {order.payment?.status}
                </Text>
                <Text style={{ fontSize: 12, color: '#666', textTransform: 'capitalize' }}>
                    {order.payment?.method}
                </Text>
            </View>
        ),
    }
];

// Define actions for each order - following the product actions structure
export const orderActions = (onViewOrder, onViewDetails) => [
    {
        id: 'view',
        icon: getActionIcon('edit', 'Ionicons'),
        color: '#2196F3',
        onPress: onViewOrder,
    },
    {
        id: 'details',
        icon: getActionIcon('document-text-outline', 'Ionicons'),
        color: '#4CAF50',
        onPress: onViewDetails,
    }
];
