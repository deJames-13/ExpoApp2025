import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import api from '../api';

const ProductDetailView = ({ route, navigation }) => {
    // Log the route params to debug what's coming through
    console.log('PRODUCT DETAIL - Route params received:', JSON.stringify(route.params));
    
    // Extract productId safely
    const { productId } = route.params || {};
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) {
                console.error('No productId provided in route params');
                setError('Product ID is missing');
                setLoading(false);
                return;
            }

            try {
                console.log(`PRODUCT DETAIL - Fetching product with ID: ${productId}`);
                setLoading(true);
                
                // Use only the productId for the API call
                const endpoint = `/api/v1/products/${productId}`;
                console.log(`PRODUCT DETAIL - API endpoint: ${endpoint}`);
                
                const response = await api.get(endpoint);
                console.log('PRODUCT DETAIL - API response:', JSON.stringify(response.data));
                
                if (response.data && response.data.resource) {
                    setProduct(response.data.resource);
                    console.log('PRODUCT DETAIL - Product data loaded successfully');
                } else {
                    console.error('PRODUCT DETAIL - No resource in response data');
                    setError('Product details not found');
                }
            } catch (err) {
                console.error('PRODUCT DETAIL - Error fetching product details:', err);
                setError(`Failed to load product details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={{ marginTop: 10 }}>Loading product details...</Text>
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.loading}>
                <Text style={{ color: 'red' }}>{error || 'Product not found'}</Text>
                <TouchableOpacity
                    style={[styles.updateButton, { marginTop: 20 }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.updateButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0].secure_url 
        : `https://picsum.photos/400/400?random=${productId}`;

    // Helper function to format price correctly
    const formatPrice = (price) => {
        if (price === undefined || price === null) return 'Price unavailable';
        // Convert string price to number if needed, then format
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return !isNaN(numPrice) ? numPrice.toFixed(2) : 'Price unavailable';
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>
                    ${formatPrice(product.price)}
                </Text>

                <View style={styles.statusContainer}>
                    <Text style={[styles.status,
                    { color: product.stock > 0 ? '#4CAF50' : '#FF9800' }]}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Text>
                </View>

                <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>
                        Rating: {product.averageRating ? product.averageRating.toFixed(1) : 'No ratings yet'}
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Product Details</Text>
                <Text style={styles.description}>{product.description || 'No description available'}</Text>

                <View style={styles.specsContainer}>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Brand:</Text>
                        <Text style={styles.specValue}>
                            {typeof product.brand === 'object' && product.brand?.name 
                                ? product.brand.name 
                                : (product.brand || 'N/A')}
                        </Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Category:</Text>
                        <Text style={styles.specValue}>
                            {typeof product.category === 'object' && product.category?.name 
                                ? product.category.name 
                                : (product.category || 'N/A')}
                        </Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Available:</Text>
                        <Text style={styles.specValue}>{product.stock || 0} units</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.quantityContainer}>
                    <Text style={styles.sectionTitle}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => quantity < product.stock && setQuantity(quantity + 1)}
                            disabled={product.stock <= quantity}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={[styles.updateButton, product.stock <= 0 && styles.disabledButton]}
                        disabled={product.stock <= 0}
                        onPress={() => {
                            // Add to cart functionality would go here
                            console.log(`Added ${quantity} of ${product.name} to cart`);
                        }}
                    >
                        <Text style={styles.updateButtonText}>Add to Cart</Text>
                    </TouchableOpacity>
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
    ratingContainer: {
        marginTop: 8,
    },
    rating: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFA000',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    }
});

export default ProductDetailView;
