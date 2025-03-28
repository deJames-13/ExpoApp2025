import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui';
import ProductCard from '~/components/Cards/product';
import api from '~/axios.config';

const DEBUG = false;

const debugLog = (...args) => {
    if (DEBUG) {
        console.log(...args);
    }
};

const debugError = (...args) => {
    if (DEBUG) {
        console.error(...args);
    }
};

export default function FeaturedProducts({ navigation, initialProducts = [] }) {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const { width } = useWindowDimensions();
    const limit = 8;

    // Determine number of columns based on screen width
    const getNumColumns = () => {
        if (width >= 1024) return 4; // Large screens (tablets landscape)
        if (width >= 768) return 3;  // Medium screens (tablets)
        return 2;                    // Small screens (phones)
    };

    const numColumns = getNumColumns();

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Function to fetch initial products
    const fetchProducts = async () => {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/api/v1/products`, {
                params: {
                    limit,
                    page: 1
                }
            });

            if (response.data && response.data.resource) {
                // Log the first product to examine its structure
                if (response.data.resource.length > 0) {
                    debugLog('First product structure:', JSON.stringify(response.data.resource[0]));
                }

                setProducts(response.data.resource);
                setPage(2);
                setHasMore(response.data.resource.length >= limit);
                debugLog(`Fetched ${response.data.resource.length} products successfully`);
            } else {
                debugLog('No products found in response:', response.data);
            }
        } catch (error) {
            debugError('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch more products for pagination
    const fetchMoreProducts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            debugLog(`Fetching more products, page ${page}`);

            const response = await api.get(`/api/v1/products`, {
                params: {
                    limit,
                    page
                }
            });

            if (response.data && response.data.resource) {
                const newProducts = response.data.resource;
                if (newProducts.length > 0) {
                    setProducts(prevProducts => [...prevProducts, ...newProducts]);
                    setPage(prevPage => prevPage + 1);
                    debugLog(`Added ${newProducts.length} more products`);
                } else {
                    debugLog('No more products to fetch');
                }
                setHasMore(newProducts.length >= limit);
            }
        } catch (error) {
            debugError('Error fetching more products:', error);
            // Don't set error state here to avoid UI disruption, just log it
        } finally {
            setLoading(false);
        }
    };

    const renderFooter = () => {
        if (!loading) return null;

        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#3b82f6" />
            </View>
        );
    };

    const renderProduct = ({ item }) => {
        // Calculate item width based on number of columns with proper margins
        const itemWidth = (width / numColumns) - 16;

        // Debug the product data structure
        debugLog('Product item structure:', JSON.stringify(item));

        // Safely extract product ID - check for different possible ID field names
        const productId = item._id || item.id || item.productId;

        // Format price with check to avoid undefined error
        const formattedPrice = item.price !== undefined && item.price !== null
            ? `$${Number(item.price).toFixed(2)}`
            : 'Price unavailable';

        // Map the database object to the format expected by ProductCard
        const productData = {
            id: productId,
            name: item.name,
            price: formattedPrice,
            image: item.images && item.images.length > 0
                ? item.images[0].secure_url
                : 'https://picsum.photos/200/200?random=1',
            averageRating: item.averageRating || 0
        };

        return (
            <ProductCard
                item={productData}
                itemWidth={itemWidth}
                onPress={() => {
                    debugLog(`Attempting to navigate directly to ProductDetailView with ID: ${productId}`);

                    if (!productId) {
                        debugError('Product ID is missing, unable to navigate to product details');
                        return;
                    }

                    // Direct navigation to ProductDetailView instead of nested navigation
                    try {
                        debugLog('NAVIGATION - Direct navigation to ProductDetailView with productId:', productId);

                        navigation.navigate('ProductDetailView', {
                            productId: productId,
                            _t: new Date().getTime()
                        });
                    } catch (error) {
                        debugError('Navigation error:', error);
                    }
                }}
            />
        );
    };

    // Render error message if there's an error
    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-4">
                <Text className="text-red-500 mb-4">{error}</Text>
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded-md"
                    onPress={fetchProducts}
                >
                    <Text className="text-white">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-4 mb-3">
                <Text className="text-lg font-bold">Featured Products</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProductsList')}>
                    <Text className="text-blue-600">See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item._id || String(Math.random())}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
                onEndReached={fetchMoreProducts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                numColumns={numColumns}
                key={`grid-${numColumns}`}
                initialNumToRender={limit}
                maxToRenderPerBatch={limit}
                windowSize={5}
            />
        </View>
    );
}