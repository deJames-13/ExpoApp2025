import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import api from '~/axios.config';
import HttpErrorView from '~/components/Errors/HttpErrorView';
import Carousel from '~/components/Carousel';
import useResource from '~/hooks/useResource';
import Toast from 'react-native-toast-message';

// Add a new component for review images
const ReviewImages = ({ images }) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return null;
    }

    return (
        <View style={styles.reviewImagesContainer}>
            <FlatList
                horizontal
                data={images}
                keyExtractor={(item, index) => item.public_id || `image-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.reviewImageWrapper}
                        // Optional: add onPress to view full image
                    >
                        <Image
                            source={{ uri: item.secure_url || item.url }}
                            style={styles.reviewImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const ProductDetailView = ({ route, navigation }) => {
    // Extract productId safely
    const { productId } = route.params || {};
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [statusCode, setStatusCode] = useState(404);
    const [addingToCart, setAddingToCart] = useState(false);
    // Add state variables for reviews
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewError, setReviewError] = useState(null);

    const { actions: { doStore: addToCart } } = useResource({ resourceName: 'cart' });

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product) {
            fetchProductReviews();
        }
    }, [product]);

    const fetchProductDetails = async () => {
        if (!productId) {
            console.error('No productId provided in route params');
            setError('Product ID is missing');
            setStatusCode(404);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const endpoint = `/api/v1/products/${productId}`;
            const response = await api.get(endpoint);

            if (response.data && response.data.resource) {
                setProduct(response.data.resource);
            } else {
                setError('Product details not found');
                setStatusCode(404);
            }
        } catch (err) {
            setError(`Failed to load product details: ${err.message}`);
            setStatusCode(err.response?.status || 'network');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductReviews = async () => {
        if (!productId) {
            setLoadingReviews(false);
            return;
        }

        try {
            setLoadingReviews(true);
            
            // Option 1: Use a different endpoint that will correctly return reviews for a product
            const response = await api.get(`/api/v1/products/${productId}/reviews`);
            
            if (response.data && response.data.resource) {
                setReviews(response.data.resource);
            } else {
                // Option 2: If the first call fails, try to get the product's reviews directly 
                // from the product object that we already have
                if (product && Array.isArray(product.reviews)) {
                    // If reviews are just IDs, we need to fetch each review
                    if (product.reviews.length > 0 && typeof product.reviews[0] !== 'object') {
                        // Fetch each review by ID
                        try {
                            const reviewPromises = product.reviews.map(reviewId => 
                                api.get(`/api/v1/reviews/${reviewId}`)
                            );
                            
                            const reviewResponses = await Promise.all(reviewPromises);
                            const fetchedReviews = reviewResponses
                                .filter(res => res.data && res.data.resource)
                                .map(res => res.data.resource);
                                
                            setReviews(fetchedReviews);
                        } catch (err) {
                            console.error('Failed to fetch individual reviews:', err);
                            setReviewError('Could not load reviews');
                            setReviews([]);
                        }
                    } else {
                        // Reviews are already complete objects
                        setReviews(product.reviews);
                    }
                } else {
                    setReviews([]);
                }
            }
        } catch (err) {
            console.error('Failed to load reviews:', err);
            
            // Fallback to try getting reviews from product object if we already have it
            if (product && Array.isArray(product.reviews) && product.reviews.length > 0) {
                try {
                    // If reviews are populated objects, use them directly
                    if (typeof product.reviews[0] === 'object' && product.reviews[0].rating) {
                        setReviews(product.reviews);
                    } else {
                        // Otherwise, fetch each review
                        const reviewPromises = product.reviews.map(reviewId => 
                            api.get(`/api/v1/reviews/${reviewId}`)
                        );
                        
                        const reviewResponses = await Promise.all(reviewPromises);
                        const fetchedReviews = reviewResponses
                            .filter(res => res.data && res.data.resource)
                            .map(res => res.data.resource);
                            
                        setReviews(fetchedReviews);
                    }
                } catch (fetchErr) {
                    console.error('Failed to fetch individual reviews:', fetchErr);
                    setReviewError('Could not load reviews');
                    setReviews([]);
                }
            } else {
                setReviewError(`Error loading reviews: ${err.message}`);
                setReviews([]);
            }
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product || product.stock <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Out of Stock',
                text2: 'This product is currently unavailable',
            });
            return;
        }

        if (quantity > product.stock) {
            Toast.show({
                type: 'error',
                text1: 'Stock Limitation',
                text2: `Only ${product.stock} units available`,
            });
            return;
        }

        try {
            setAddingToCart(true);

            const cartData = {
                product: product.id,
                quantity: quantity
            };

            const response = await addToCart(cartData);
            if (response && response.error) {
                throw new Error(response.error);
            }
            const responseData = response.resource || response;
            const wasUpdatedItem = response.message && response.message.includes('Quantity increased');
            const successMessage = wasUpdatedItem
                ? `Updated cart! Added ${quantity} more ${quantity > 1 ? 'items' : 'item'}`
                : `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to your cart`;

            if (responseData && (responseData.id || responseData._id)) {
                Toast.show({
                    type: 'success',
                    text1: wasUpdatedItem ? 'Cart Updated' : 'Added to Cart',
                    text2: successMessage,
                });
                Alert.alert(
                    wasUpdatedItem ? "Cart Updated" : "Added to Cart",
                    "Would you like to view your cart or continue shopping?",
                    [
                        {
                            text: "Continue Shopping",
                            style: "cancel"
                        },
                        {
                            text: "View Cart",
                            onPress: () => {
                                navigation.navigate('DefaultNav', {
                                    screen: 'DefaultRoutes',
                                    params: {
                                        screen: 'Cart',
                                        params: { refresh: true }
                                    }
                                });
                            }
                        }
                    ]
                );
            } else if (response && response.success === true) {
                // Alternative success format
                Toast.show({
                    type: 'success',
                    text1: 'Added to Cart',
                    text2: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
                });

                // Standard Alert for navigation options
                Alert.alert(
                    "Added to Cart",
                    "Would you like to view your cart or continue shopping?",
                    [
                        {
                            text: "Continue Shopping",
                            style: "cancel"
                        },
                        {
                            text: "View Cart",
                            onPress: () => {
                                // Same navigation logic as above
                                try {
                                    navigation.navigate('Cart', { refresh: true });
                                } catch (navError) {
                                    try {
                                        navigation.navigate('DefaultRoutes', {
                                            screen: 'Cart',
                                            params: { refresh: true }
                                        });
                                    } catch (nestedNavError) {
                                        navigation.navigate('DefaultNav', {
                                            screen: 'DefaultRoutes',
                                            params: {
                                                screen: 'Cart',
                                                params: { refresh: true }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    ]
                );
            } else {
                console.info("Unexpected but valid response format:", response);
                Toast.show({
                    type: 'info',
                    text1: 'Added to Cart',
                    text2: 'Item was added to your cart',
                });
            }
        } catch (error) {
            console.error("Add to cart error:", error);
            Toast.show({
                type: 'error',
                text1: 'Error Adding to Cart',
                text2: error.message || 'Failed to add item to cart. Please try again.',
            });
        } finally {
            setAddingToCart(false);
        }
    };

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
            <HttpErrorView
                statusCode={statusCode}
                message={error || 'Product details could not be found'}
                resourceType="Product"
                onRetry={fetchProductDetails}
            />
        );
    }

    // Default image fallback for the carousel
    const defaultImage = process.env.EXPO_PUBLIC_APP_LOGO;

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

            <Carousel
                images={product.images}
                height={250}
                defaultImage={defaultImage}
                containerStyle={styles.imageContainer}
            />

            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>
                    {process.env.EXPO_PUBLIC_APP_CURRENCY} {formatPrice(product.price)}
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
                            disabled={quantity <= 1}
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
                        style={[
                            styles.updateButton,
                            (product.stock <= 0 || addingToCart) && styles.disabledButton
                        ]}
                        disabled={product.stock <= 0 || addingToCart}
                        onPress={handleAddToCart}
                    >
                        {addingToCart ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.updateButtonText}>Add to Cart</Text>
                        )}
                    </TouchableOpacity>
                </View>
                
                {/* Reviews Section */}
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Customer Reviews</Text>
                
                {loadingReviews ? (
                    <View style={styles.reviewsLoading}>
                        <ActivityIndicator size="small" color="#2196F3" />
                        <Text style={styles.reviewsLoadingText}>Loading reviews...</Text>
                    </View>
                ) : reviewError ? (
                    <Text style={styles.reviewErrorText}>{reviewError}</Text>
                ) : reviews.length === 0 ? (
                    <Text style={styles.noReviewsText}>No reviews yet for this product</Text>
                ) : (
                    <View style={styles.reviewsContainer}>
                        {reviews.map((review, index) => (
                            <View key={review._id || index} style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.reviewAuthor}>
                                        {review.isAnonymous ? 'Anonymous User' : (review.user?.name || 'Anonymous User')}
                                    </Text>
                                    <View style={styles.ratingStars}>
                                        <Text style={styles.reviewRating}>
                                            {review.rating} ★
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.reviewTitle}>{review.title}</Text>
                                <Text style={styles.reviewDescription}>{review.description}</Text>
                                
                                {/* Display review images if they exist */}
                                <ReviewImages images={review.images} />
                                
                                <Text style={styles.reviewDate}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
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
    },
    // Review section styles
    reviewsContainer: {
        marginTop: 8,
    },
    reviewItem: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewAuthor: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    ratingStars: {
        flexDirection: 'row',
    },
    reviewRating: {
        color: '#FFA000',
        fontSize: 16,
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    reviewDescription: {
        fontSize: 14,
        color: '#424242',
        marginBottom: 8,
        lineHeight: 20,
    },
    reviewDate: {
        fontSize: 12,
        color: '#757575',
        textAlign: 'right',
    },
    reviewErrorText: {
        color: '#F44336',
        marginVertical: 8,
    },
    noReviewsText: {
        fontStyle: 'italic',
        color: '#757575',
        marginVertical: 8,
    },
    reviewsLoading: {
        alignItems: 'center',
        padding: 16,
    },
    reviewsLoadingText: {
        marginTop: 8,
        color: '#757575',
    },
    // Review image styles
    reviewImagesContainer: {
        marginVertical: 10,
    },
    reviewImageWrapper: {
        marginRight: 10,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    reviewImage: {
        width: 80,
        height: 80,
    },
});

export default ProductDetailView;
