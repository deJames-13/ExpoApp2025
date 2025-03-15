import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CartHeader from './CartHeader'
import CartList from './CartList'

export function CartPage({ navigation }) {
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'Ray-Ban Aviator', price: 149.99, quantity: 1, status: 'In Stock' },
        { id: '2', name: 'Oakley Holbrook', price: 129.99, quantity: 2, status: 'In Stock' },
        { id: '3', name: 'Gucci GG0036S', price: 299.99, quantity: 1, status: 'Processing' },
    ]);

    // Selection state - can be moved to Redux later
    const [selectedItems, setSelectedItems] = useState({});

    const [searchQuery, setSearchQuery] = useState('');

    // Action handlers - can be moved to Redux actions later
    const handleToggleSelection = (itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleSelectAll = () => {
        const newSelectedItems = {};
        cartItems.forEach(item => {
            newSelectedItems[item.id] = true;
        });
        setSelectedItems(newSelectedItems);
    };

    const handleDeselectAll = () => {
        setSelectedItems({});
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleViewDetails = (itemId) => {
        navigation.navigate('CartDetailView', { itemId });
    };

    const handleCheckout = () => {
        // Only checkout selected items
        const itemsToCheckout = cartItems.filter(item => selectedItems[item.id]);

        // Navigate to Checkout with selected items
        navigation.navigate('DefaultRoutes', {
            screen: 'Checkout',
            params: {
                items: itemsToCheckout
            }
        });
    };

    const filteredItems = cartItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Selectors - can be moved to Redux selectors later
    const selectedCount = Object.values(selectedItems).filter(Boolean).length;
    const totalAmount = cartItems
        .filter(item => selectedItems[item.id])
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <SafeAreaView style={styles.container}>
            <CartHeader
                onSearch={handleSearch}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                selectedCount={selectedCount}
                totalCount={cartItems.length}
            />
            <CartList
                items={filteredItems}
                onViewDetails={handleViewDetails}
                selectedItems={selectedItems}
                onToggleSelection={handleToggleSelection}
            />
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Selected Items: {selectedCount}</Text>
                <Text style={styles.summaryText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
                <TouchableOpacity
                    style={[styles.checkoutButton, selectedCount === 0 && styles.disabledButton]}
                    onPress={handleCheckout}
                    disabled={selectedCount === 0}
                >
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
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
        marginBottom: 8,
    },
    checkoutButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    checkoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
    }
});