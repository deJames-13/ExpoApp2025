import React, { useState, useEffect } from 'react';
import {
    View,
    SafeAreaView,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    TextInput,
    useWindowDimensions,
    Modal
} from 'react-native';
import { Text } from '~/components/ui';
import ProductCard from '~/components/Cards/product';
import Icon from 'react-native-vector-icons/Ionicons';
import useResource from '~/hooks/useResource';
import CategoryList from '../Home/components/CategoryList';
import Slider from '@react-native-community/slider';

const MIN_PRICE = 1000;
const MAX_PRICE = 10000;

// Search Header Component
const SearchHeader = ({ navigation, searchQuery, setSearchQuery, handleSearchSubmit, setShowFilterModal }) => (
    <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mx-4 mt-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-2">
            <Icon name="arrow-back" size={20} color="gray" />
        </TouchableOpacity>
        <Icon name="search-outline" size={20} color="gray" />
        <TextInput
            placeholder="Search for eyewear..."
            className="flex-1 ml-2 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            autoFocus={!searchQuery}
            returnKeyType="search"
        />
        <TouchableOpacity
            className="ml-2 p-2 bg-gray-200 rounded-full"
            onPress={() => setShowFilterModal(true)}
        >
            <Icon name="options-outline" size={20} color="black" />
        </TouchableOpacity>
    </View>
);

// Filter Bar Component
const FilterBar = ({ activeFilter, filters, handleFilterChange, setShowFilterModal }) => (
    <View className="flex-row justify-between items-center px-4 my-4">
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filters}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
                <TouchableOpacity
                    className={`px-4 py-2 rounded-full mr-2 ${activeFilter === item ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                    onPress={() => handleFilterChange(item)}
                >
                    <Text className={activeFilter === item ? 'text-white font-medium' : 'text-gray-700'}>
                        {item}
                    </Text>
                </TouchableOpacity>
            )}
            className="flex-1"
        />

    </View>
);

// Active Filters Component
const ActiveFilters = ({ selectedCategory, priceRange, setSelectedCategory, setPriceRange, setMinPrice, setMaxPrice }) => {
    if (!selectedCategory && priceRange[0] === MIN_PRICE && priceRange[1] === MAX_PRICE) return null;

    return (
        <View className="flex-row flex-wrap px-4 mb-2">
            {selectedCategory && (
                <View className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-blue-800 text-sm">{selectedCategory.name}</Text>
                    <TouchableOpacity onPress={() => setSelectedCategory(null)} className="ml-1">
                        <Icon name="close-circle" size={16} color="#1e40af" />
                    </TouchableOpacity>
                </View>
            )}

            {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                <View className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-blue-800 text-sm">
                        ${priceRange[0]} - ${priceRange[1]}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setPriceRange([MIN_PRICE, MAX_PRICE]);
                            setMinPrice(MIN_PRICE);
                            setMaxPrice(MAX_PRICE);
                        }}
                        className="ml-1"
                    >
                        <Icon name="close-circle" size={16} color="#1e40af" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// Price Range Slider Component
const PriceRangeSlider = ({ priceRange, setPriceRange, setMinPrice, setMaxPrice }) => {
    const [minValue, setMinValue] = useState(priceRange[0]);
    const [maxValue, setMaxValue] = useState(priceRange[1]);

    const handleMinChange = (value) => {
        // Ensure min doesn't exceed max
        setMinValue(value > maxValue ? maxValue : value);
    };

    const handleMaxChange = (value) => {
        // Ensure max doesn't go below min
        setMaxValue(value < minValue ? minValue : value);
    };

    const handleValueComplete = () => {
        setPriceRange([minValue, maxValue]);
        setMinPrice(minValue.toString());
        setMaxPrice(maxValue.toString());
    };

    return (
        <View className="px-4 mb-4">
            <View className="mb-4">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500">Min: PHP{minValue}</Text>
                </View>
                <Slider
                    value={minValue}
                    minimumValue={MIN_PRICE}
                    maximumValue={maxValue}
                    step={10}
                    minimumTrackTintColor="#3b82f6"
                    maximumTrackTintColor="#e5e7eb"
                    thumbTintColor="#3b82f6"
                    onValueChange={handleMinChange}
                    onSlidingComplete={handleValueComplete}
                />
            </View>

            <View>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500">Max: PHP{maxValue}</Text>
                </View>
                <Slider
                    value={maxValue}
                    minimumValue={minValue}
                    maximumValue={MAX_PRICE}
                    step={10}
                    minimumTrackTintColor="#3b82f6"
                    maximumTrackTintColor="#e5e7eb"
                    thumbTintColor="#3b82f6"
                    onValueChange={handleMaxChange}
                    onSlidingComplete={handleValueComplete}
                />
            </View>

            <View className="flex-row justify-between mt-4">
                <Text className="text-gray-700 font-medium">Range: PHP{minValue} - PHP{maxValue}</Text>
            </View>
        </View>
    );
};

// Filter Modal Component
const FilterModal = ({
    visible,
    setVisible,
    priceRange,
    minPrice,
    maxPrice,
    setPriceRange,
    setMinPrice,
    setMaxPrice,
    handleCategorySelect,
    selectedCategory,
    clearFilters
}) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
    >
        <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl p-5 h-2/3">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold">Filters</Text>
                    <TouchableOpacity onPress={() => setVisible(false)}>
                        <Icon name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <Text className="text-lg font-bold mt-6 mb-2">Price Range</Text>
                <PriceRangeSlider
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                />

                <Text className="text-lg font-bold mt-4 mb-2">Categories</Text>
                <View className="h-40">
                    <CategoryList
                        onSelectCategory={(category) => {
                            handleCategorySelect(category);
                            setVisible(false);
                        }}
                        selectedCategory={selectedCategory}
                    />
                </View>

                <View className="flex-row mt-auto">
                    <TouchableOpacity
                        className="flex-1 bg-gray-200 py-3 rounded-xl mr-2"
                        onPress={() => {
                            clearFilters();
                            setVisible(false);
                        }}
                    >
                        <Text className="text-center font-medium">Clear All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 bg-blue-600 py-3 rounded-xl ml-2"
                        onPress={() => setVisible(false)}
                    >
                        <Text className="text-center text-white font-medium">Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

// Empty Results Component
const EmptyResults = ({ clearFilters }) => (
    <View className="flex-1 justify-center items-center p-4">
        <Icon name="search-outline" size={48} color="#CBD5E1" />
        <Text className="text-xl font-medium mt-4 text-center">No products found</Text>
        <Text className="text-gray-500 mt-2 text-center">
            Try adjusting your search or filter criteria
        </Text>
        <TouchableOpacity
            className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
            onPress={clearFilters}
        >
            <Text className="text-white font-medium">Clear Filters</Text>
        </TouchableOpacity>
    </View>
);

// Main Search Screen Component
export function SearchedScreen({ route, navigation }) {
    const { query = '', filter = 'All' } = route.params || {};
    const [searchQuery, setSearchQuery] = useState(query);
    const [activeFilter, setActiveFilter] = useState(filter);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
    const [minPrice, setMinPrice] = useState(MIN_PRICE);
    const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const { width } = useWindowDimensions();

    const filters = ['All', 'Newest', 'Popular'];

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

    const performSearch = () => {
        let queryParams = '';

        if (searchQuery) {
            queryParams += `name[$regex]=${searchQuery}&name[$options]=i&`;
        }

        if (selectedCategory) {
            queryParams += `category=${selectedCategory.id}&`;
        }

        if (activeFilter === 'Newest') {
            queryParams += 'sort=-createdAt&';
        } else if (activeFilter === 'Popular') {
            queryParams += 'sort=-averageRating&';
        } else if (activeFilter === 'Sale') {
            queryParams += 'discount=true&';
        }

        queryParams += `price[$gte]=${priceRange[0]}&price[$lte]=${priceRange[1]}&`;

        fetchDatas({ qStr: queryParams });
    };

    useEffect(() => {
        performSearch();
    }, [searchQuery, activeFilter, selectedCategory, priceRange]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleSearchSubmit = () => {
        performSearch();
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(prev =>
            prev && prev.id === category.id ? null : category
        );
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setPriceRange([MIN_PRICE, MAX_PRICE]);
        setMinPrice(MIN_PRICE);
        setMaxPrice(MAX_PRICE);
        setActiveFilter('All');
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

    return (
        <SafeAreaView className="flex-1 bg-white">
            <SearchHeader
                navigation={navigation}
                searchQuery={searchQuery}
                setSearchQuery={handleSearch}
                handleSearchSubmit={handleSearchSubmit}
                setShowFilterModal={setShowFilterModal}
            />

            <FilterBar
                activeFilter={activeFilter}
                filters={filters}
                handleFilterChange={handleFilterChange}
                setShowFilterModal={setShowFilterModal}
            />

            <ActiveFilters
                selectedCategory={selectedCategory}
                priceRange={priceRange}
                setSelectedCategory={setSelectedCategory}
                setPriceRange={setPriceRange}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
            />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="mt-4">Searching products...</Text>
                </View>
            ) : products.length === 0 ? (
                <EmptyResults clearFilters={clearFilters} />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={item => item._id || item.id || String(Math.random())}
                    numColumns={numColumns}
                    key={`grid-${numColumns}`}
                    contentContainerStyle={{ padding: 8 }}
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                />
            )}

            <FilterModal
                visible={showFilterModal}
                setVisible={setShowFilterModal}
                priceRange={priceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setPriceRange={setPriceRange}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                handleCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
                clearFilters={clearFilters}
            />
        </SafeAreaView>
    );
}