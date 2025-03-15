import { View, Text } from 'react-native';
import React from 'react';

export function ProfileStats({ stats }) {
    return (
        <View className="flex-row justify-between bg-white rounded-xl p-4 mb-4" style={{ elevation: 2 }}>
            {stats.map((item, index) => (
                <View key={index} className="items-center px-4">
                    <Text className="text-lg font-bold text-blue-500">{item.value}</Text>
                    <Text className="text-gray-500 text-sm">{item.label}</Text>
                </View>
            ))}
        </View>
    );
}
