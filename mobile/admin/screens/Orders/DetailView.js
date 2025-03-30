import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Snackbar } from 'react-native-paper';
import { OrderForm } from './form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { adminColors } from '~/styles/adminTheme';
import useResource from '~/hooks/useResource';

export function OrderDetailView() {
    const navigation = useNavigation();
    const route = useRoute();
    const { order: initialOrder } = route.params || {};

    // Initialize useResource hook
    const api = useResource({ resourceName: 'orders', silent: false });
    const { fetchData, doUpdate } = api.actions;
    const { loading, current } = api.states;
    const { showSuccess } = api.toast;

    const [order, setOrder] = useState(initialOrder);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Load order details on mount and when id changes
    useEffect(() => {
        if (initialOrder?.id) {
            loadOrderDetails(initialOrder.id);
        }
    }, [initialOrder?.id]);

    // Update local state when api.current changes
    useEffect(() => {
        if (current) {
            setOrder(current);
        }
    }, [current]);

    const loadOrderDetails = async (id) => {
        try {
            await fetchData({ id });
        } catch (error) {
            console.error('Error fetching order details:', error);
            setSnackbarMessage('Failed to load order details');
            setSnackbarVisible(true);
        }
    };

    const handleStatusChange = async (order, newStatus) => {
        try {
            let orderId = order.id;
            await doUpdate(orderId, {
                user: order?.user?.id,
                status: newStatus,
                order: order
            });

            // Status labels for user feedback
            const statusLabels = {
                'pending': 'Pending',
                'processing': 'Processing',
                'shipped': 'Shipped',
                'delivered': 'Delivered',
                'cancelled': 'Cancelled'
            };

            setSnackbarMessage(`Order status updated to ${statusLabels[newStatus]}`);
            setSnackbarVisible(true);

            // Reload the order details
            loadOrderDetails(orderId);
        } catch (error) {
            console.error('Error updating order status:', error);
            setSnackbarMessage('Failed to update order status');
            setSnackbarVisible(true);
        }
    };

    // Handler to refresh order data
    const handleRefresh = () => {
        if (order?.id) {
            loadOrderDetails(order.id);
            showSuccess('Refreshed', 'Order data refreshed successfully');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content
                    title={`Order #${order?.id?.substring(0, 8) || 'Detail'}`}
                    color={adminColors.text.primary}
                />
                <Appbar.Action icon="refresh" onPress={handleRefresh} color={adminColors.text.secondary} />
            </Appbar.Header>

            <OrderForm
                order={order}
                onStatusChange={handleStatusChange}
                isModal={false}
                isLoading={loading}
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={styles.snackbar}
                action={{
                    label: 'OK',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: adminColors.background,
    },
    header: {
        backgroundColor: adminColors.cardBackground,
        elevation: 4,
    },
    snackbar: {
        backgroundColor: adminColors.background,
    },
});
