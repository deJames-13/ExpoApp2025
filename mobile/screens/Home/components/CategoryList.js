import { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui';
import Icon from 'react-native-vector-icons/Ionicons';
import useResource from '~/hooks/useResource.js';

export default function CategoryList({ categories = [], onSelectCategory }) {
    const resource = useResource('categories');
    const { states: { data, loading }, actions: { fetchDatas } } = resource;

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            className="items-center mx-3"
            onPress={() => onSelectCategory ? onSelectCategory(item) : null}
        >
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Icon name={item.icon || 'grid-outline'} size={28} color="#3b82f6" />
            </View>
            <Text className="text-sm text-center">{item.name}</Text>
        </TouchableOpacity>
    );

    useEffect(() => {
        console.log('CategoryList: Fetching categories...');
        fetchDatas();
    }, []);

    useEffect(() => {
        console.log('CategoryList: Data updated:', data);
    }, [data]);

    return (
        <View className="mb-6">
            <Text className="text-lg font-bold px-4 mb-3">Categories</Text>

            {loading ? (
                <View className="h-20 items-center justify-center">
                    <ActivityIndicator color="#3b82f6" />
                </View>
            ) : data && data.length > 0 ? (
                <FlatList
                    data={data}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            ) : (
                <View className="h-20 items-center justify-center">
                    <Text className="text-gray-500">No categories available</Text>
                </View>
            )}
        </View>
    );
}
