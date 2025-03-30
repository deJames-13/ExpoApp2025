import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResourceTable } from '~/components/ResourceTable';
import { Button, IconButton } from 'react-native-paper';
import { orderTableColumns, orderActions } from './table-data';
import { mockOrders } from './data';
import { OrderModal } from './modal';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function Orders({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        // Simulate API fetch
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // In a real app, this would be an API call
                setTimeout(() => {
                    setOrders(mockOrders);
                    setTotalItems(mockOrders.length);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleViewDetails = (order) => {
        // Updated to use the new screen name
        navigation.navigate('AdminRoutesStack', {
            screen: 'AdminOrderDetail',
            params: { order }
        });
    };

    const handleStatusChange = (orderId, newStatus) => {
        // Update order status (in a real app, this would be an API call)
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        setModalVisible(false);
    };

    const handlePageChange = (page, itemsPerPage) => {
        console.log(`Page changed to ${page}, items per page: ${itemsPerPage}`);
        // In a real app, this would trigger an API call with pagination params
    };

    const handleSearch = (searchQuery) => {
        console.log(`Search query: ${searchQuery}`);
        // In a real app, this would trigger an API call with search params
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="refresh"
                    size={24}
                    onPress={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setOrders(mockOrders);
                            setLoading(false);
                        }, 500);
                    }}
                />
            </View>

            <ResourceTable
                data={orders}
                columns={orderTableColumns}
                actions={orderActions(handleViewOrder, handleViewDetails)}
                loading={loading}
                pagination={true}
                onPageChange={handlePageChange}
                initialItemsPerPage={10}
                searchEnabled={true}
                onSearch={handleSearch}
                emptyText="No orders found"
                serverSide={false}
                totalServerItems={totalItems}
            />

            {selectedOrder && (
                <OrderModal
                    visible={modalVisible}
                    order={selectedOrder}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedOrder(null);
                    }}
                    onStatusChange={handleStatusChange}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 8,
    },
});