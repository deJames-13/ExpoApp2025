import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Snackbar } from 'react-native-paper';
import { OrderForm } from './form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { adminColors } from '~/styles/adminTheme';

export function OrderDetailView() {
    const navigation = useNavigation();
    const route = useRoute();
    const { order: initialOrder } = route.params || {};

    const [order, setOrder] = useState(initialOrder);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Update local order data when route params change
    useEffect(() => {
        if (initialOrder) {
            setOrder(initialOrder);
        }
    }, [initialOrder]);

    const handleStatusChange = (orderId, newStatus) => {
        // In a real app, this would make an API call to update the order
        console.log(`Updating order ${orderId} status to ${newStatus}`);

        // Update local order state
        setOrder(prevOrder => ({
            ...prevOrder,
            status: newStatus
        }));

        // Show success message
        const statusLabels = {
            'pending': 'Pending',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };

        setSnackbarMessage(`Order status updated to ${statusLabels[newStatus]}`);
        setSnackbarVisible(true);
    };

    // Handler to refresh order data
    const handleRefresh = () => {
        // In a real app, this would fetch updated order data from API
        setSnackbarMessage('Order data refreshed');
        setSnackbarVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={`Order #${order?.orderNumber}`} color={adminColors.text.primary} />
                <Appbar.Action icon="refresh" onPress={handleRefresh} color={adminColors.text.secondary} />
            </Appbar.Header>

            <OrderForm
                order={order}
                onStatusChange={handleStatusChange}
                isModal={false}
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
