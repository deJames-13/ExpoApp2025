import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import useResource from '~/hooks/useResource';
import Toast from 'react-native-toast-message';

const CartDetailView = ({ route, navigation }) => {
    // Extract all parameters from the route
    const {
        itemId,
        cartItemId,
        quantity: initialQuantity = 1,
        price: initialPrice
    } = route.params || {};

    // Products resource for product details
    const {
        states: { current: productDetails, loading: productLoading },
        actions: { fetchData: fetchProductData }
    } = useResource({ resourceName: 'products' });

    // Cart resource for cart operations
    const {
        actions: { doUpdate: updateCart, doDestroy: removeFromCart }
    } = useResource({ resourceName: 'cart' });

    const [quantity, setQuantity] = useState(initialQuantity);
    const [price, setPrice] = useState(initialPrice || 0);

    // Fetch the product details on component mount
    useEffect(() => {
        if (itemId) {
            fetchProductData({ id: itemId });
        }
    }, [itemId]);

    // Update quantity and price when route params change
    useEffect(() => {
        // Convert to numbers to ensure proper comparison later
        setQuantity(Number(initialQuantity));
        setPrice(Number(initialPrice) || 0);
    }, [initialQuantity, initialPrice]);

    const handleQuantityChange = async (newQuantity) => {
        // Ensure we have product details and valid quantity
        if (newQuantity < 1 || !productDetails) return;
        if (productDetails.stock < newQuantity) {
            Toast.show({
                type: 'error',
                text1: 'Limit Exceeded',
                text2: `Only ${productDetails.stock} items available in stock`,
                visibilityTime: 3000
            });
            return;
        }

        // Convert to number to ensure proper type
        setQuantity(Number(newQuantity));
    };

    const handleUpdateCart = async () => {
        // Validate we have all required data
        if (!productDetails) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Product details not available',
                visibilityTime: 3000
            });
            return;
        }

        if (!cartItemId) {
            Toast.show({
                type: 'error',
                text1: 'Cart Error',
                text2: 'Cannot update: Cart item ID not available',
                visibilityTime: 3000
            });
            return;
        }

        // No change in quantity - use Number to ensure proper comparison
        if (Number(quantity) === Number(initialQuantity)) {
            Toast.show({
                type: 'info',
                text1: 'No Change',
                text2: 'Quantity has not been changed',
                visibilityTime: 3000
            });
            return;
        }

        try {
            // Update the cart item with new quantity AND total price
            const updatedTotal = Number(itemPrice) * Number(quantity);
            let response = await updateCart(cartItemId, {
                product: itemId,
                quantity: Number(quantity),
                price: Number(itemPrice),
                total: updatedTotal
            });
            response = response.resource

            if (response && (response.id || response._id)) {
                const total = itemPrice * quantity;
                const formattedPrice = process.env.EXPO_PUBLIC_APP_CURRENCY + ' ' + total.toFixed(2);
                Toast.show({
                    type: 'success',
                    text1: 'Cart Updated Successfully',
                    text2: `${productDetails.name}: ${quantity} items (${formattedPrice})`,
                    visibilityTime: 4000,
                    position: 'bottom'
                });
            }

        } catch (error) {
            console.error('Cart update error:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.message || 'Failed to update cart',
                visibilityTime: 3000
            });
        }
    };

    const handleRemoveFromCart = () => {
        if (!cartItemId) {
            Toast.show({
                type: 'error',
                text1: 'Cart Error',
                text2: 'Cannot remove: Cart item ID not available',
                visibilityTime: 3000
            });
            return;
        }

        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from your cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    onPress: async () => {
                        try {
                            await removeFromCart(cartItemId);
                            Toast.show({
                                type: 'success',
                                text1: 'Item Removed',
                                text2: 'Item has been removed from your cart',
                                visibilityTime: 3000
                            });
                            // Navigate back to the Cart screen
                            navigation.navigate('DefaultRoutes', {
                                screen: 'Cart',
                                params: { refresh: true }
                            });
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                                text2: error.message || 'Failed to remove item',
                                visibilityTime: 3000
                            });
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    // Show loading while fetching product details
    if (productLoading || !productDetails) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text>Loading product details...</Text>
            </View>
        );
    }

    // Calculate stock status based on product details
    const isInStock = productDetails.stock > 0;
    const stockStatus = isInStock ? 'In Stock' : 'Out of Stock';

    // We use the price from the cart item, not from the product
    // This accounts for any special pricing in the cart that might differ from the product price
    const itemPrice = price || (typeof productDetails.price === 'string'
        ? parseFloat(productDetails.price)
        : productDetails.price);

    // Convert to Number for comparison to ensure proper disable logic
    const quantityChanged = Number(quantity) !== Number(initialQuantity);

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('DefaultRoutes', {
                    screen: 'Cart',
                    params: { refresh: true }
                })}
            >
                <Text style={styles.backButtonText}>← Back to Cart</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: productDetails.images[0]?.url || process.env.EXPO_PUBLIC_APP_LOGO }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{productDetails.name || 'Product'}</Text>
                <Text style={styles.price}>
                    {process.env.EXPO_PUBLIC_APP_CURRENCY} {itemPrice.toFixed(2)}
                </Text>

                <View style={styles.statusContainer}>
                    <Text style={[styles.status, {
                        color: isInStock ? '#4CAF50' : '#FF9800'
                    }]}>
                        {stockStatus}
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Product Details</Text>
                <Text style={styles.description}>{productDetails.description || 'No description available'}</Text>

                <View style={styles.specsContainer}>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Brand:</Text>
                        <Text style={styles.specValue}>
                            {productDetails.brand || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Category:</Text>
                        <Text style={styles.specValue}>
                            {productDetails.category || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Available:</Text>
                        <Text style={styles.specValue}>{productDetails.stock || 0} units</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.quantityContainer}>
                    <Text style={styles.sectionTitle}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleQuantityChange(quantity + 1)}
                            disabled={!isInStock || quantity >= productDetails.stock}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.subtotalText}>
                    Subtotal: {process.env.EXPO_PUBLIC_APP_CURRENCY} {(itemPrice * quantity).toFixed(2)}
                </Text>

                <View style={styles.actionsContainer}>
                    {cartItemId ? (
                        <>
                            <TouchableOpacity
                                style={[
                                    styles.updateButton,
                                    (!isInStock || !quantityChanged) && styles.disabledButton
                                ]}
                                onPress={handleUpdateCart}
                                disabled={!isInStock || !quantityChanged}
                            >
                                <Text style={styles.updateButtonText}>
                                    {quantityChanged ? 'Update Cart' : 'No Changes'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={handleRemoveFromCart}
                            >
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={[styles.updateButton, !isInStock && styles.disabledButton]}
                            disabled={!isInStock}
                            onPress={() => {
                                navigation.navigate('ProductDetailView', {
                                    productId: itemId
                                });
                            }}
                        >
                            <Text style={styles.updateButtonText}>View Product Details</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        padding: 16,
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
    },
    imageContainer: {
        height: 250,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 20,
        color: '#2196F3',
        marginTop: 8,
    },
    statusContainer: {
        marginTop: 16,
    },
    status: {
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#424242',
        lineHeight: 24,
    },
    specsContainer: {
        marginTop: 16,
    },
    specItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    specLabel: {
        fontSize: 16,
        fontWeight: '500',
        width: 100,
    },
    specValue: {
        fontSize: 16,
        color: '#424242',
    },
    quantityContainer: {
        marginBottom: 16,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#f5f5f5',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityValue: {
        fontSize: 18,
        marginHorizontal: 16,
    },
    actionsContainer: {
        marginTop: 24,
        flexDirection: 'row',
    },
    updateButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        backgroundColor: '#ffebee',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtotalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#2196F3',
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
    }
});

export default CartDetailView;
