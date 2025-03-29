import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTable } from './context';

export function SearchBar() {
    const { searchQuery, handleSearch } = useTable();

    return (
        <View className="p-3 bg-gray-50 border-b border-gray-200">
            <View className="flex-row items-center bg-white rounded-lg border border-gray-300 px-3 py-1">
                <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                <TextInput
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Search..."
                    className="flex-1 px-2 py-1 text-gray-700"
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </View>
    );
}
