import { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui';
import ProductCard from '~/components/Cards/product';
import useResource from '~/hooks/useResource.js';


export default function FeaturedProducts({ navigation, initialProducts = [] }) {

    const resource = useResource('products')
    const { states: { data }, actions: { fetchDatas } } = resource;

    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const { width } = useWindowDimensions();
    const limit = 8;

    const getNumColumns = () => {
        if (width >= 1024) return 4;
        if (width >= 768) return 3;
        return 2;
    };

    const numColumns = getNumColumns();

    const fetchMoreProducts = () => {
        if (loading || !hasMore) return;

        // Function to fetch initial products
        const fetchProducts = async () => {
            if (loading) return;

            setLoading(true);
            try {
                setTimeout(() => {
                    const timestamp = new Date().getTime();
                    const moreProducts = [
                        ...Array(4).fill().map((_, i) => ({
                            id: `${timestamp}-${page}-${i + 1}`,
                            name: `Product ${products.length + i + 1}`,
                            price: `$${(Math.random() * 200 + 99).toFixed(2)}`,
                            image: `https://picsum.photos/200/200?random=${products.length + i + 1}`,
                            sold: Math.floor(Math.random() * 500) + 10
                        }))
                    ];

                    if (page >= 3) {
                        setHasMore(false);
                    }
                })
            } catch (error) {
                console.error('Error fetching products:', error);
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
                console.log(`Fetching more products, page ${page}`);

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
                        console.log(`Added ${newProducts.length} more products`);
                    } else {
                        console.log('No more products to fetch');
                    }
                    setHasMore(newProducts.length >= limit);
                }
            } catch (error) {
                console.error('Error fetching more products:', error);
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
            const itemWidth = (width / numColumns) - 16;// Calculate item width based on number of columns with proper margins

            return (
                <ProductCard
                    item={productData}
                    itemWidth={itemWidth}
                    onPress={() => {
                        console.log(`Attempting to navigate directly to IndivProduct with ID: ${productId}`);

                        if (!productId) {
                            console.error('Product ID is missing, unable to navigate to product details');
                            return;
                        }

                        // Direct navigation to IndivProduct instead of nested navigation
                        try {
                            console.log('NAVIGATION - Direct navigation to IndivProduct with productId:', productId);

                            navigation.navigate('IndivProduct', {
                                productId: productId,
                                _t: new Date().getTime() // Add timestamp to prevent caching
                            });
                        } catch (error) {
                            console.error('Navigation error:', error);
                        }
                    }}
                />
            );
        };

        useEffect(() => {
            if (data?.length) setProducts(data)
        }, [data])

        useEffect(() => {
            fetchDatas()
        }, [])


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

}
