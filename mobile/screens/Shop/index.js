import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator, FlatList, useWindowDimensions } from 'react-native';
import { Text } from '~/components/ui';
import SearchFilter from '../Home/components/SearchFilter';
import ProductCard from '~/components/Cards/product';
import CategoryList from '../Home/components/CategoryList';
import useResource from '~/hooks/useResource';
import { categories } from '../Home/data';

export default function ShopScreen({ navigation }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filter, setFilter] = useState('All');
    const { width } = useWindowDimensions();

    const {
        states: { data: products, loading },
        actions: { fetchDatas }
    } = useResource({ resourceName: 'products' });

    // Determine number of columns based on screen width
    const getNumColumns = () => {
        if (width >= 1024) return 4;
        if (width >= 768) return 3;
        return 2;
    };
    const numColumns = getNumColumns();

    useEffect(() => {
        let queryParams = '';

        if (selectedCategory) {
            queryParams += `category=${selectedCategory.id}&`;
        }

        if (filter === 'Newest') {
            queryParams += 'sort=-createdAt&';
        } else if (filter === 'Popular') {
            queryParams += 'sort=-averageRating&';
        } else if (filter === 'Sale') {
            queryParams += 'discount=true&';
        }

        fetchDatas({ qStr: queryParams });
    }, [selectedCategory, filter]);

    const handleSearch = (query) => {
        if (query.trim()) {
            navigation.navigate('SearchedScreen', { query, filter });
        }
    };

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const renderProduct = ({ item }) => {
        const itemWidth = (width / numColumns) - 16;
        const productId = item._id || item.id;

        const productData = {
            id: productId,
            name: item.name,
            price: item.price,
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
                    navigation.navigate('ProductDetailView', {
                        productId: productId,
                    });
                }}
            />
        );
    };

    const renderHeader = () => (
        <>
            <SearchFilter
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
            />

            <CategoryList
                categories={categories}
                onSelectCategory={handleCategorySelect}
            />
        </>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            {loading && products.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="mt-4">Loading products...</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={item => item._id || item.id || String(Math.random())}
                    numColumns={numColumns}
                    key={`grid-${numColumns}`}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                />
            )}
        </SafeAreaView>
    );
}

export { SearchedScreen } from './search';