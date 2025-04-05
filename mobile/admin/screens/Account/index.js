import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/states/slices/auth';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '~/screens/LoadingScreen';
import { Button } from 'react-native-paper';
import useLogout from '~/hooks/useLogout';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileMenuItem } from './components/ProfileMenuItem';
import { ProfileStats } from './components/ProfileStats';
import { accountStyles } from '~/admin/styles/accountStyles';
import { adminColors } from '~/styles/adminTheme';

export function AdminAccount() {
    const navigation = useNavigation();
    const currentUser = useSelector(selectCurrentUser);
    const { logout, isLoading } = useLogout();

    if (isLoading) {
        return <LoadingScreen />;
    }

    // Format user data for display
    const userData = {
        name: currentUser?.info ? `${currentUser.info.first_name} ${currentUser.info.last_name}` : currentUser?.username || 'Admin User',
        email: currentUser?.email || 'No email provided',
        location: currentUser?.info ? `${currentUser.info.city}, ${currentUser.info.region}` : 'Location not set',
        avatar: currentUser?.info?.avatar?.url || currentUser?.info?.photoUrl || null,
        role: currentUser?.role || 'Admin',
    };

    // Admin stats data
    const statsData = [
        { label: 'Users', value: '0' },
        { label: 'Orders', value: '0' },
        { label: 'Products', value: '0' },
    ];

    // Menu items for admin
    const menuItems = [
        { 
            title: 'Edit Profile', 
            icon: 'account-edit-outline', 
            onPress: () => navigation.navigate('AdminRoutesStack', { screen: 'AdminEditProfile' })
        },
        { 
            title: 'Notifications Settings', 
            icon: 'bell-outline', 
            onPress: () => navigation.navigate('AdminRoutesStack', { screen: 'Notifications' })
        },
        // { 
        //     title: 'System Settings', 
        //     icon: 'cog-outline', 
        //     onPress: () => navigation.navigate('AdminRoutesStack', { screen: 'AdminSettings' })
        // },
        { 
            title: 'Help & Support', 
            icon: 'help-circle-outline', 
            onPress: () => navigation.navigate('AdminRoutesStack', { screen: 'AdminSupport' })
        },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaView style={[accountStyles.container, { flex: 1 }]}>
            <ScrollView 
                style={{ flex: 1 }}
                contentContainerStyle={accountStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ProfileHeader user={userData} />

                <ProfileStats stats={statsData} />

                <View style={accountStyles.infoContainer}>
                    {menuItems.map((item, index) => (
                        <ProfileMenuItem
                            key={index}
                            title={item.title}
                            icon={item.icon}
                            onPress={item.onPress}
                        />
                    ))}
                </View>

                <Button
                    mode="contained"
                    icon="logout"
                    onPress={handleLogout}
                    textColor={adminColors.background}
                    style={{ 
                        marginTop: 20,
                        backgroundColor: adminColors.status.error,
                    }}
                >
                    Logout
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

// This explicit default export is important for navigation
export default AdminAccount;
