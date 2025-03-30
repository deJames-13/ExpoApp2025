import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import CartCard from '~/components/Cards/cart';
import { ActivityIndicator } from 'react-native';

const CartList = ({
    items,
    onViewDetails,
    onDeleteItem,
    selectedItems = {}, // Add default empty object
    onToggleSelection,
    loading,
    navigation,
    onRefresh,
    refreshing
}) => {
    const renderItem = ({ item }) => {
        // Ensure we have the required product data
        if (!item || !item.product) {
            console.warn("Invalid cart item format:", item);
            return null;
        }

        return (
            <CartCard
                item={item}
                // Pass the entire item to handle both cart item ID and product details
                onViewDetails={() => onViewDetails(item)}
                onDeleteItem={() => onDeleteItem(item.id)}
                isSelected={selectedItems?.[item.id] || false}
                onToggleSelection={() => onToggleSelection(item.id)}
            />
        );
    };

    const renderEmptyList = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#2196F3" />
                    <Text style={styles.loadingText}>Loading cart items...</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Image
                    source={require('~/assets/images/no_cart.png')}
                    style={styles.emptyImage}
                    resizeMode="contain"
                />
                <Text style={styles.emptyText}>No items in your cart</Text>
                <Text style={styles.emptySubtext}>Add products to your cart to see them here</Text>
                <TouchableOpacity
                    style={styles.shopButton}
                    onPress={() => {
                        if (navigation) {
                            navigation.navigate('TabsRoute', { screen: 'Home' });
                        }
                    }}
                >
                    <Text style={styles.shopButtonText}>Shop Now</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    items.length === 0 && styles.emptyListContent
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyList}
                refreshing={refreshing}
                onRefresh={onRefresh}
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
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#757575',
    },
    emptyImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
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
        marginBottom: 20,
    },
    shopButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    shopButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CartList;
