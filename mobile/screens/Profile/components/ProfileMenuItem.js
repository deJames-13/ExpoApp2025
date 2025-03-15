import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getIconForRoute } from '../../../utils/iconHelper';
import { globalStyles } from '../../../styles/global';

export function ProfileMenuItem({ title, route, onPress, iconOverride, showBadge, badgeCount }) {
    const iconName = iconOverride || getIconForRoute(route);

    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center py-4 px-5 bg-white mb-2 rounded-xl"
            style={globalStyles.shadow}
        >
            <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                <MaterialCommunityIcons name={iconName} size={22} color="#3b82f6" />
            </View>

            <View className="flex-1 flex-row items-center justify-between">
                <Text className="text-base font-medium ml-3">{title}</Text>

                <View className="flex-row items-center">
                    {showBadge && (
                        <View className="mr-2" style={globalStyles.badge}>
                            <Text style={globalStyles.badgeText}>{badgeCount}</Text>
                        </View>
                    )}
                    <MaterialCommunityIcons name="chevron-right" size={22} color="#9ca3af" />
                </View>
            </View>
        </TouchableOpacity>
    );
}
