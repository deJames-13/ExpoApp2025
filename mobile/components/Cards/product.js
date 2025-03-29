import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Text } from '~/components/ui';
import { globalStyles } from '~/styles/global';

export default function ProductCard({ item, itemWidth, onPress }) {
    return (
        <TouchableOpacity
            style={[
                globalStyles.card,
                {
                    margin: 8,
                    width: itemWidth,
                }
            ]}
            onPress={onPress}
        >
            <View>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: 120, borderRadius: 8 }}
                />
                <View className="p-2">
                    <Text className="font-semibold text-sm" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-blue-600 font-bold">{process.env.EXPO_PUBLIC_APP_CURRENCY} {item.price}</Text>
                    {item.sold && (
                        <Text className="text-gray-500 text-xs">{item.sold} sold</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
