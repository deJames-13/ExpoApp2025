import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '~/components/ui';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CategoryList({ categories = [], onSelectCategory }) {
    const renderCategory = ({ item }) => (
        <TouchableOpacity
            className="items-center mx-3"
            onPress={() => onSelectCategory ? onSelectCategory(item) : null}
        >
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Icon name={item.icon} size={28} color="#3b82f6" />
            </View>
            <Text className="text-sm text-center">{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View className="mb-6">
            <Text className="text-lg font-bold px-4 mb-3">Categories</Text>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            />
        </View>
    );
}
