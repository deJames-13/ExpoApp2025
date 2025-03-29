import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, useWindowDimensions, SafeAreaView } from 'react-native';
import { Text } from '~/components/ui';
import ProductCard from '~/components/Cards/product';
import useResource from '~/hooks/useResource.js';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CategorizedProducts({ route, navigation }) {
    const { category } = route.params || {};
    const { width } = useWindowDimensions();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [allProducts, setAllProducts] = useState([]);

    // Use resource hook for fetching products
    const productResource = useResource({ resourceName: 'products' });
    const {
        states: { data: products, loading },
        actions: { fetchDatas }
    } = productResource;

    // Determine number of columns based on screen width
    const getNumColumns = () => {
        if (width >= 1024) return 4; // Large screens (tablets landscape)
        if (width >= 768) return 3;  // Medium screens (tablets)
        return 2;                    // Small screens (phones)
    };

    const numColumns = getNumColumns();

    // Fetch products filtered by category
    useEffect(() => {
        if (category && category.id) {
            const queryString = `?category=${category.id}&page=${page}&limit=8`;
            fetchDatas({ qStr: queryString });
        }
    }, [category, page]);

    // Update allProducts when new products are loaded
    useEffect(() => {
        if (products && products.length > 0) {
            if (page === 1) {
                setAllProducts(products);
            } else {
                setAllProducts(prev => [...prev, ...products]);
            }

            // Determine if there are more products to load
            if (products.length < 8) {
                setHasMore(false);
            }
        }
    }, [products]);

    const loadMoreProducts = () => {
        if (!loading && hasMore) {
            setPage(prevPage => prevPage + 1);
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

        // Safely extract product ID
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
                : process.env.EXPO_PUBLIC_APP_LOGO,
            averageRating: item.averageRating || 0
        };

        return (
            <ProductCard
                item={productData}
                itemWidth={itemWidth}
                onPress={() => {
                    if (!productId) {
                        console.error('Product ID is missing, unable to navigate to product details');
                        return;
                    }

                    navigation.navigate('ProductDetailView', {
                        productId: productId,
                        _t: new Date().getTime()
                    });
                }}
            />
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-bold">{category ? category.name : 'Products'}</Text>
            </View>

            {loading && allProducts.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="mt-4">Loading products...</Text>
                </View>
            ) : allProducts.length === 0 ? (
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-lg text-gray-500">No products found in this category</Text>
                    <TouchableOpacity
                        className="bg-blue-500 px-4 py-2 rounded-md mt-4"
                        onPress={() => navigation.goBack()}
                    >
                        <Text className="text-white">Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={allProducts}
                    renderItem={renderProduct}
                    keyExtractor={item => item._id || String(Math.random())}
                    contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
                    onEndReached={loadMoreProducts}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    numColumns={numColumns}
                    key={`grid-${numColumns}`}
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                    windowSize={5}
                />
            )}
        </SafeAreaView>
    );
}
