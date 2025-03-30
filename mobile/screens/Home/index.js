import React from 'react';
import { View } from 'react-native';
import SearchFilter from './components/SearchFilter';
import BannerCarousel from './components/BannerCarousel';
import CategoryList from './components/CategoryList';
import FeaturedProducts from './components/FeaturedProducts';
import { FlatList } from 'react-native-gesture-handler';
import {
    banners,
    categories,
    initialProducts,
} from './data'

export function Home({ navigation }) {
    const handleSearch = (query) => {
        console.log('Search query:', query);
        // Search will be handled by SearchFilter component navigation
    };

    const handleFilterChange = (filter) => {
        console.log('Filter selected:', filter);
    };

    const handleCategorySelect = (category) => {
        console.log('Selected category:', category.name);
        navigation.navigate('CategorizedProducts', { category });
    };

    const renderProduct = () => (
        <FeaturedProducts navigation={navigation} initialProducts={initialProducts} />
    );

    const renderHeader = () => (
        <>
            <SearchFilter
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
            />

            <BannerCarousel banners={banners} />

            <CategoryList
                categories={categories}
                onSelectCategory={handleCategorySelect}
            />
        </>
    );

    return (
        <View className="flex-1 bg-white">
            <FlatList
                data={['1']}
                keyExtractor={(item) => item}
                renderItem={renderProduct}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}