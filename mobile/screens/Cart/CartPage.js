import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import CartHeader from './CartHeader'
import CartList from './CartList'
import useResource from '~/hooks/useResource';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import resourceEndpoints from '~/states/api/resources';
import { useSelector, useDispatch } from 'react-redux';
import { toggleItemSelection, selectAllItems, deselectAllItems } from '~/states/slices/cart';

export function CartPage({ navigation, route }) {
    const {
        states: { data: cartItems, loading, refresh },
        actions: { fetchDatas, doDestroy },
        events: { onDestroy }
    } = useResource({ resourceName: 'cart' });

    const selectedItems = useSelector(state => {
        return state.cart?.selectedItems || {};
    });
    const dispatch = useDispatch();

    const [localSelectedItems, setLocalSelectedItems] = useState({});

    useEffect(() => {
        if (selectedItems && Object.keys(selectedItems).length > 0) {
            setLocalSelectedItems(selectedItems);
        }
    }, [selectedItems]);

    const effectiveSelectedItems = Object.keys(selectedItems).length > 0
        ? selectedItems
        : localSelectedItems;

    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { params } = route || {};
    const shouldRefresh = params?.refresh || false;

    useEffect(() => {
        fetchDatas();
        if (shouldRefresh && navigation.setParams) {
            navigation.setParams({ refresh: false });
        }
    }, [refresh, shouldRefresh]);

    const handleToggleSelection = (itemId) => {
        setLocalSelectedItems(prev => {
            const updated = { ...prev };
            if (updated[itemId]) {
                delete updated[itemId];
            } else {
                updated[itemId] = true;
            }
            return updated;
        });

        try {
            dispatch(toggleItemSelection(itemId));
        } catch (error) {
            console.error('Error toggling selection:', error);
        }
    };

    const handleSelectAll = () => {
        dispatch(selectAllItems(cartItems));
    };

    const handleDeselectAll = () => {
        setLocalSelectedItems({});
        dispatch(deselectAllItems());
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleViewDetails = (item) => {
        navigation.navigate('DefaultRoutes', {
            screen: 'CartDetailView',
            params: {
                itemId: item.product.id,
                cartItemId: item.id,
                quantity: item.quantity,
                price: item.price
            }
        });
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchDatas();
            Toast.show({
                type: 'success',
                text1: 'Cart Updated',
                text2: 'Your cart has been refreshed',
                visibilityTime: 2000,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Refresh Failed',
                text2: 'Unable to refresh cart data',
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleDeleteItem = (itemId) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => {
                        setIsRefreshing(true);
                        doDestroy(itemId).then(() => {
                            const updatedItems = cartItems.filter(item => item.id !== itemId);

                            Toast.show({
                                type: 'success',
                                text1: 'Item Removed',
                                text2: 'The item was removed from your cart',
                            });

                            fetchDatas().finally(() => {
                                setIsRefreshing(false);
                            });
                        }).catch(error => {
                            setIsRefreshing(false);
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Failed to remove item from cart',
                            });
                        });
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleClearCart = () => {
        if (cartItems.length === 0) {
            Toast.show({
                type: 'info',
                text1: 'Cart Empty',
                text2: 'Your cart is already empty',
            });
            return;
        }

        Alert.alert(
            "Clear Cart",
            "Are you sure you want to remove all items from your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear All",
                    onPress: async () => {
                        try {
                            const response = await resourceEndpoints.useClearCartMutation()[0]().unwrap();
                            Toast.show({
                                type: 'success',
                                text1: 'Cart Cleared',
                                text2: 'All items were removed from your cart',
                            });
                            fetchDatas();
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: 'Failed to clear cart',
                            });
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleCheckout = () => {
        const itemsToCheckout = cartItems.filter(item => effectiveSelectedItems[item.id]);

        if (itemsToCheckout.length === 0) {
            Toast.show({
                type: 'info',
                text1: 'No Items Selected',
                text2: 'Please select items to checkout',
            });
            return;
        }

        // Make sure Redux store has the selected items before navigating
        // This ensures SummaryAndConfirmation can access the selection state
        dispatch(selectAllItems(itemsToCheckout));

        // Calculate the subtotal of selected items
        const subtotal = itemsToCheckout.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0);

        // Navigate with complete item data
        navigation.navigate('DefaultRoutes', {
            screen: 'Checkout',
            params: {
                items: itemsToCheckout,
                subtotal: subtotal,
                selectedItems: Object.keys(effectiveSelectedItems).reduce((obj, id) => {
                    obj[id] = true;
                    return obj;
                }, {})
            }
        });
    };

    const filteredItems = cartItems.filter(item =>
        item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCount = Object.keys(effectiveSelectedItems).length;
    const totalAmount = cartItems
        .filter(item => effectiveSelectedItems[item.id])
        .reduce((sum, item) => sum + (item.total || 0), 0);

    if (loading && cartItems.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading cart items...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CartHeader
                navigation={navigation}
                onSearch={handleSearch}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onClearCart={handleClearCart}
                onRefresh={handleRefresh}
                selectedCount={selectedCount}
                totalCount={cartItems.length}
            />
            <CartList
                navigation={navigation}
                items={filteredItems}
                onViewDetails={handleViewDetails}
                onDeleteItem={handleDeleteItem}
                selectedItems={effectiveSelectedItems}
                onToggleSelection={handleToggleSelection}
                loading={loading || isRefreshing}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
            />
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Selected Items: {selectedCount}</Text>
                <Text style={styles.summaryText}>Total Amount: {process.env.EXPO_PUBLIC_APP_CURRENCY} {totalAmount.toFixed(2)}</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        color: '#757575',
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