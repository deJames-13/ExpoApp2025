import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import React from 'react';
import OrderCard from '~/components/Cards/order';

const OrderList = ({ orders, onViewDetails, onReviewPress, onRefresh, isLoading, error }) => {
    const renderItem = ({ item }) => (
        <OrderCard
            order={{
                id: item.id,
                orderNumber: item.id?.substring(0, 8) || 'Unknown',
                date: new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                totalAmount: item.total || 0,
                items: item.products || [],
                status: item.status || 'pending'
            }}
            onReviewPress={() => { onReviewPress(item) }}
            onViewDetails={onViewDetails}
        />
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            {error ? (
                <>
                    <Text style={styles.errorText}>Error loading orders</Text>
                    <Text style={styles.emptySubtext}>{error}</Text>
                </>
            ) : (
                <>
                    <Text style={styles.emptyText}>No orders found</Text>
                    <Text style={styles.emptySubtext}>Your order history will appear here</Text>
                </>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id || Math.random().toString()}
                contentContainerStyle={[
                    styles.listContent,
                    !orders.length && styles.emptyListContent
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyList}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        colors={['#2196F3']}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 24,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#757575',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F44336',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
    },
});

export default OrderList;
