import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/global';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileMenuItem } from './components/ProfileMenuItem';
import { ProfileStats } from './components/ProfileStats';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../states/slices/auth';
import LoadingScreen from '../LoadingScreen';
import { useNavigation } from '@react-navigation/native';
import useLogout from '../../hooks/useLogout';

export function Profile() {
    const navigation = useNavigation();
    const currentUser = useSelector(selectCurrentUser);
    const { logout, isLoading } = useLogout();

    if (isLoading) {
        return <LoadingScreen />;
    }

    // Format user data for display
    const userData = {
        name: currentUser?.info ? `${currentUser.info.first_name} ${currentUser.info.last_name}` : currentUser?.username || 'Guest User',
        email: currentUser?.email || 'No email provided',
        location: currentUser?.info ? `${currentUser.info.city}, ${currentUser.info.region}` : 'Location not set',
        avatar: currentUser?.info?.avatar?.url || currentUser?.info?.photoUrl || null,
    };

    // Stats data - can be connected to real data when available
    const statsData = [
        { label: 'Orders', value: '0' },
        { label: 'Reviews', value: '0' },
        { label: 'Points', value: '0' },
    ];

    // Menu items
    const menuItems = [
        { title: 'My Orders', route: 'orders', onPress: () => navigation.navigate('Orders'), showBadge: false },
        { title: 'Cart', route: 'cart', onPress: () => navigation.navigate('Cart'), showBadge: false },
        { title: 'Reviews', route: 'reviews', onPress: () => navigation.navigate('Reviews'), showBadge: false },
        { title: 'Notifications', route: 'notifications', onPress: () => navigation.navigate('Notifications'), },
    ];

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    onPress: logout
                }
            ]
        );
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <ProfileHeader user={userData} onEditProfile={handleEditProfile} />

                <View className="px-4 flex-1">
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

                    {/* Flexible spacer to push logout button to bottom */}
                    <View style={{ flex: 1, minHeight: 20 }} />

                    <TouchableOpacity
                        className="mt-6 mb-10 flex-row items-center justify-center py-3 bg-red-50 rounded-xl"
                        onPress={handleLogout}
                    >
                        <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
                        <Text className="ml-2 text-red-500 font-medium">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}