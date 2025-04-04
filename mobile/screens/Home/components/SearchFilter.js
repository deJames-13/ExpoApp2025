import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '~/components/ui';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function SearchFilter({ onSearch, onFilterChange }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    // const filters = ['All', 'Newest', 'Popular', 'Sale'];
    const navigation = useNavigation();

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (onSearch) onSearch(text);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            navigation.navigate('SearchedScreen', {
                query: searchQuery,
                filter: activeFilter
            });
        }
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (onFilterChange) onFilterChange(filter);
    };

    return (
        <View className="px-4 pt-6 pb-2">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
                <Icon name="search-outline" size={20} color="gray" />
                <TextInput
                    placeholder="Search for eyewear..."
                    className="flex-1 ml-2 text-base"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        onPress={handleSearchSubmit}
                        className="bg-blue-600 rounded-full p-1"
                    >
                        <Icon name="arrow-forward" size={16} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        className={`px-4 py-2 rounded-full mr-2 ${activeFilter === filter ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                        onPress={() => handleFilterChange(filter)}
                    >
                        <Text className={activeFilter === filter ? 'text-white font-medium' : 'text-gray-700'}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
