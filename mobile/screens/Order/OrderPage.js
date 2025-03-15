import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import OrderHeader from './OrderHeader';
import OrderList from './OrderList';

export function OrderPage({ navigation }) {
    const [orders, setOrders] = useState([
        {
            id: '1',
            orderNumber: '1234-5678',
            date: 'June 12, 2023',
            totalAmount: 149.99,
            items: [{ id: '1', name: 'Ray-Ban Aviator' }],
            status: 'Delivered'
        },
        {
            id: '2',
            orderNumber: '2345-6789',
            date: 'May 30, 2023',
            totalAmount: 259.98,
            items: [
                { id: '2', name: 'Oakley Holbrook' },
                { id: '3', name: 'Gucci GG0036S' }
            ],
            status: 'Shipped'
        },
        {
            id: '3',
            orderNumber: '3456-7890',
            date: 'May 15, 2023',
            totalAmount: 429.97,
            items: [
                { id: '4', name: 'Persol PO3019S' },
                { id: '5', name: 'Tom Ford FT0709' },
                { id: '6', name: 'Maui Jim Red Sands' }
            ],
            status: 'Processing'
        }
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleViewDetails = (orderId) => {
        navigation.navigate('OrderDetailView', { orderId });
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <SafeAreaView style={styles.container}>
            <OrderHeader onSearch={handleSearch} />
            <OrderList
                orders={filteredOrders}
                onViewDetails={handleViewDetails}
            />

            {/* Order Summary or Stats */}
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Orders: {orders.length}</Text>
                <View style={styles.statContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>
                            {orders.filter(o => o.status === 'Delivered').length}
                        </Text>
                        <Text style={styles.statLabel}>Delivered</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>
                            {orders.filter(o => o.status === 'Shipped').length}
                        </Text>
                        <Text style={styles.statLabel}>Shipped</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>
                            {orders.filter(o => o.status === 'Processing').length}
                        </Text>
                        <Text style={styles.statLabel}>Processing</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    summary: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        marginTop: 'auto',
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    statLabel: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    }
});
