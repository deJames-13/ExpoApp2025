import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Text } from '~/components/ui';
import { globalStyles } from '~/styles/global';
import Icon from 'react-native-vector-icons/Ionicons';

// Helper component to display star ratings
const StarRating = ({ rating }) => {
    // Ensure rating is between 0-5
    const safeRating = Math.min(5, Math.max(0, rating || 0));
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <View className="flex-row items-center my-1">
            {/* Full stars */}
            {[...Array(fullStars)].map((_, i) => (
                <Icon key={`full-${i}`} name="star" size={14} color="#FFD700" />
            ))}

            {/* Half star */}
            {halfStar && (
                <Icon key="half" name="star-half" size={14} color="#FFD700" />
            )}

            {/* Empty stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <Icon key={`empty-${i}`} name="star-outline" size={14} color="#FFD700" />
            ))}

            {/* Display numeric rating */}
            <Text className="text-xs text-gray-600 ml-1">
                {safeRating.toFixed(1)}
            </Text>
        </View>
    );
};

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

                    {/* Star rating component */}
                    <StarRating rating={item.averageRating} />

                    <Text className="text-blue-600 font-bold">{process.env.EXPO_PUBLIC_APP_CURRENCY} {item.price}</Text>
                    {item.sold && (
                        <Text className="text-gray-500 text-xs">{item.sold} sold</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}
