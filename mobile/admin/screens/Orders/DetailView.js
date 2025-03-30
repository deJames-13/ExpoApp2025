import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { OrderForm } from './form';
import { useNavigation, useRoute } from '@react-navigation/native';

export function OrderDetailView() {
    const navigation = useNavigation();
    const route = useRoute();
    const { order } = route.params || {};

    const handleStatusChange = (orderId, newStatus) => {
        // In a real app, this would make an API call to update the order
        console.log(`Updating order ${orderId} status to ${newStatus}`);

        // Show success message and navigate back
        setTimeout(() => {
            alert(`Order status updated to ${newStatus}`);
            navigation.goBack();
        }, 500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={`Order #${order?.orderNumber}`} />
                <Appbar.Action icon="refresh" onPress={() => {
                    // In a real app, this would refresh the order data
                    alert('Order data refreshed');
                }} />
            </Appbar.Header>

            <OrderForm
                order={order}
                onStatusChange={handleStatusChange}
                isModal={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});
