import React from 'react';
import { View, TouchableOpacity, Image, useWindowDimensions, ScrollView } from 'react-native';
import { Text } from '~/components/ui';
import SearchFilter from './components/SearchFilter';
import BannerCarousel from './components/BannerCarousel';
import CategoryList from './components/CategoryList';
import FeaturedProducts from './components/FeaturedProducts';
import { globalStyles } from '~/styles/global';
import { FlatList } from 'react-native-gesture-handler';

export function Home({ navigation }) {
    // Mock data
    const banners = [
        { id: '1', image: 'https://picsum.photos/800/300?random=1' },
        { id: '2', image: 'https://picsum.photos/800/300?random=2' },
        { id: '3', image: 'https://picsum.photos/800/300?random=3' },
    ];

    const categories = [
        { id: '1', name: 'Glasses', icon: 'glasses-outline' },
        { id: '2', name: 'Sunglasses', icon: 'sunny-outline' },
        { id: '3', name: 'Contacts', icon: 'eye-outline' },
        { id: '4', name: 'Accessories', icon: 'briefcase-outline' },
        { id: '5', name: 'Offers', icon: 'pricetag-outline' },
    ];

    const initialProducts = [
        { id: '1', name: 'Ray-Ban Aviator', price: '$129.99', image: 'https://picsum.photos/200/200?random=1', sold: 253 },
        { id: '2', name: 'Oakley Holbrook', price: '$149.99', image: 'https://picsum.photos/200/200?random=2', sold: 187 },
        { id: '3', name: 'Gucci Square', price: '$299.99', image: 'https://picsum.photos/200/200?random=3', sold: 105 },
        { id: '4', name: 'Prada Modern', price: '$249.99', image: 'https://picsum.photos/200/200?random=4', sold: 89 },
    ];

    const handleSearch = (query) => {
        console.log('Search query:', query);
        // Implement search functionality
    };

    const handleFilterChange = (filter) => {
        console.log('Filter selected:', filter);
        // Apply filtering logic
    };

    const handleCategorySelect = (category) => {
        console.log('Selected category:', category.name);
        // Navigate to category or filter products
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
                keyExtractor={(item) => item} // Fixed: Now uses the string itself as the key
                renderItem={renderProduct}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}