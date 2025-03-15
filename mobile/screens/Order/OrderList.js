import { View, FlatList, Text, StyleSheet } from 'react-native';
import React from 'react';
import OrderCard from '~/components/Cards/order';

const OrderList = ({ orders, onViewDetails }) => {
    const renderItem = ({ item }) => (
        <OrderCard
            order={item}
            onViewDetails={onViewDetails}
        />
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>Your order history will appear here</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyList}
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
    emptySubtext: {
        fontSize: 14,
        color: '#9E9E9E',
        textAlign: 'center',
    },
});

export default OrderList;
