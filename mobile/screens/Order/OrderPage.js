import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/states/slices/auth';
import OrderHeader from './OrderHeader';
import OrderList from './OrderList';
import LoadingScreen from '../LoadingScreen';
import useResource from '~/hooks/useResource';

export function OrderPage({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const user = useSelector(selectCurrentUser);

    // Initialize the resource hook for orders
    const api = useResource({ resourceName: 'orders', silent: false });
    const { fetchDatas } = api.actions;
    const { loading, data: orders, refresh } = api.states;
    const { showError } = api.toast;

    useEffect(() => {
        loadOrders();
    }, [refresh]);

    const loadOrders = async () => {
        if (!user) return;

        try {
            // You can add query params here if needed
            await fetchDatas({ verbose: false });
        } catch (err) {
            console.error('Error fetching orders:', err);
            showError('Error', 'Failed to load your orders');
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleViewDetails = (orderId) => {
        navigation.navigate('OrderDetailView', { orderId });
    };

    const handleRefresh = () => {
        loadOrders();
    };

    const handleReviewPress = (order) => {
        // Navigate to review form with order info
        navigation.navigate('Reviews', {
            screen: 'ReviewForm',
            params: { order }
        });
    };

    const filteredOrders = searchQuery
        ? orders.filter(order =>
            order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.products?.some(product =>
                product.name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : orders;

    if (loading && !orders.length) {
        return <LoadingScreen message="Loading your orders..." />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <OrderHeader onSearch={handleSearch} />
            <OrderList
                orders={filteredOrders}
                onViewDetails={handleViewDetails}
                onReviewPress={handleReviewPress}
                onRefresh={handleRefresh}
                isLoading={loading}
                error={null}
            />

            {/* Order Summary or Stats */}
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Orders: {orders.length}</Text>
                <View style={styles.statContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>
                            {orders.filter(o => o.status === 'delivered').length}
                        </Text>
                        <Text style={styles.statLabel}>Delivered</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>
                            {orders.filter(o => o.status === 'shipped').length}
                        </Text>
                        <Text style={styles.statLabel}>Shipped</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>
                            {orders.filter(o => o.status === 'processing' || o.status === 'pending').length}
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
