import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui';
import { globalStyles } from '~/styles/global';
import ProductCard from '~/components/Cards/product';

export default function FeaturedProducts({ navigation, initialProducts = [] }) {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { width } = useWindowDimensions();

    // Determine number of columns based on screen width
    const getNumColumns = () => {
        if (width >= 1024) return 4; // Large screens (tablets landscape)
        if (width >= 768) return 3;  // Medium screens (tablets)
        return 2;                    // Small screens (phones)
    };

    const numColumns = getNumColumns();

    // Simulated data fetching for pagination
    const fetchMoreProducts = () => {
        if (loading || !hasMore) return;

        setLoading(true);

        // Simulate API fetch with setTimeout
        setTimeout(() => {
            // For demo: generate more products based on current page
            // Using timestamp in ID to ensure uniqueness
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

            // Stop pagination after page 3 for demo purposes
            if (page >= 3) {
                setHasMore(false);
            }

            setProducts(currentProducts => [...currentProducts, ...moreProducts]);
            setPage(page + 1);
            setLoading(false);
        }, 1000);
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

        return (
            <ProductCard
                key={item.id}
                item={item}
                itemWidth={itemWidth}
                onPress={() => console.log(`Selected product: ${item.name}`)}
            />
        );
    };

    return (
        <View className="flex-1">
            <View className="flex-row justify-between items-center px-4 mb-3">
                <Text className="text-lg font-bold">Featured Products</Text>
                <TouchableOpacity onPress={() => console.log('See all products')}>
                    <Text className="text-blue-600">See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
                onEndReached={fetchMoreProducts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                numColumns={numColumns}
                key={`grid-${numColumns}`}
            />
        </View>
    );
}
