import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../../../styles/global';

export function ProfileHeader({ user, onEditProfile }) {
    return (
        <View className="items-center py-6 bg-white rounded-b-3xl mb-4" style={globalStyles.shadow}>
            <View className="relative">
                {user.avatar ? (
                    <Image
                        source={{ uri: user.avatar }}
                        className="w-24 h-24 rounded-full"
                    />
                ) : (
                    <View className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center">
                        <MaterialCommunityIcons name="account" size={72} color="#888" />
                    </View>
                )}
                <TouchableOpacity
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full items-center justify-center"
                    onPress={onEditProfile}
                >
                    <MaterialCommunityIcons name="pencil" size={16} color="white" />
                </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold mt-3">{user.name}</Text>
            <Text className="text-gray-500">{user.email}</Text>

            <View className="flex-row items-center mt-2">
                <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                <Text className="text-gray-500 ml-1">{user.location || 'Not specified'}</Text>
            </View>
        </View>
    );
}
