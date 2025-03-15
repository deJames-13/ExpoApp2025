import { View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/global';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileMenuItem } from './components/ProfileMenuItem';
import { ProfileStats } from './components/ProfileStats';

export function Profile({ navigation }) {
    // Mock user data - in a real app, this would come from a state management solution or API
    const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        location: 'New York, USA',
    };

    // Mock stats data
    const statsData = [
        { label: 'Orders', value: '12' },
        { label: 'Reviews', value: '4' },
        { label: 'Points', value: '256' },
    ];

    // Menu items
    const menuItems = [
        { title: 'My Orders', route: 'orders', onPress: () => navigation.navigate('Orders'), showBadge: true, badgeCount: '2' },
        { title: 'Favorites', route: 'favorites', onPress: () => navigation.navigate('Favorites') },
        { title: 'Shipping Addresses', route: 'addresses', iconOverride: 'map-marker', onPress: () => navigation.navigate('Addresses') },
        { title: 'Payment Methods', route: 'payment', iconOverride: 'credit-card', onPress: () => navigation.navigate('PaymentMethods') },
        { title: 'Account Settings', route: 'settings', onPress: () => navigation.navigate('Settings') },
        { title: 'Help Center', route: 'help', onPress: () => navigation.navigate('HelpCenter') },
    ];

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <ProfileHeader user={userData} onEditProfile={handleEditProfile} />

                <View className="px-4">
                    <ProfileStats stats={statsData} />

                    <Text className="text-lg font-bold mb-2">Account</Text>

                    {menuItems.map((item, index) => (
                        <ProfileMenuItem
                            key={index}
                            title={item.title}
                            route={item.route}
                            onPress={item.onPress}
                            iconOverride={item.iconOverride}
                            showBadge={item.showBadge}
                            badgeCount={item.badgeCount}
                        />
                    ))}

                    <TouchableOpacity
                        className="mt-6 mb-10 flex-row items-center justify-center py-3 bg-red-50 rounded-xl"
                        onPress={() => alert('Logout pressed')}
                    >
                        <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
                        <Text className="ml-2 text-red-500 font-medium">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}