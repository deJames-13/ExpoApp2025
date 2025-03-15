import { View, FlatList, Text, StyleSheet } from 'react-native';
import React from 'react';
import CartCard from '~/components/Cards/cart';

const CartList = ({ items, onViewDetails, selectedItems, onToggleSelection }) => {
    const renderItem = ({ item }) => (
        <CartCard
            item={item}
            onViewDetails={onViewDetails}
            isSelected={selectedItems?.[item.id] || false}
            onToggleSelection={onToggleSelection}
        />
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items in your cart</Text>
            <Text style={styles.emptySubtext}>Add products to your cart to see them here</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
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

export default CartList;
