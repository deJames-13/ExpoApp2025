import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Divider, Avatar, ActivityIndicator } from 'react-native-paper';
import { tabRoutes, adminRoutes } from '../routes/_admin-routes';
import { globalStyles } from '~/styles/global';
import navigationStyles from '~/styles/navigationStyles';
import useAuth from '~/hooks/useAuth';
import useLogout from '~/hooks/useLogout';

export function AdminDrawerContent() {
    const [curr, setCurr] = React.useState('Dashboard'); // Default to Dashboard
    const navigation = useNavigation();
    const { isAuthenticated, currentUser, isAdmin } = useAuth();
    const { logout, isLoading } = useLogout();
    const drawerRoutes = adminRoutes();
    const tabbedRoutes = tabRoutes();

    useEffect(() => {
        if (isAuthenticated && !isAdmin) {
            // console.log('Non-admin user trying to access admin panel, redirecting...');
            navigation.navigate('DefaultNav');
        } else if (!isAuthenticated) {
            // console.log('Unauthenticated user trying to access admin panel, redirecting to login...');
            navigation.navigate("GuestNav", { screen: 'Login' });
        } else {
            // console.log('Admin user confirmed, allowing access to admin panel');
        }
    }, [isAuthenticated, isAdmin, navigation]);

    // Extract admin-specific user info for display
    const adminName = currentUser?.username || 'Admin User';
    const adminRole = currentUser?.role || 'Administrator';
    const adminEmail = currentUser?.email || '';
    const adminInitials = (currentUser?.username?.substring(0, 2) || 'AU').toUpperCase();

    return (
        <SafeAreaView style={[navigationStyles.drawerContainer, styles.container]}>
            {/* Admin Header with User Info */}
            <View style={[navigationStyles.drawerHeader, styles.header]}>
                <View style={[globalStyles.row, styles.logoContainer]}>
                    <Image
                        source={require('~/assets/icon.png')}
                        style={styles.logoImage}
                    />
                    <Text style={styles.logoText}>
                        EyeZone Admin
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={50}
                        label={adminInitials}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>{adminName}</Text>
                    <Text style={styles.userRole}>{adminRole}</Text>
                    {adminEmail && <Text style={styles.userEmail}>{adminEmail}</Text>}
                </View>
            </View>

            <Divider style={globalStyles.divider} />

            {/* Admin Navigation Menu */}
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={navigationStyles.drawerItemsContainer}>
                    {/* Tabbed Navigations */}
                    {tabbedRoutes.map((route) => (
                        <TouchableOpacity
                            key={route.name}
                            style={[
                                navigationStyles.drawerItem,
                                curr === route.name && styles.activeItem,
                                globalStyles.row
                            ]}
                            onPress={() => {
                                setCurr(route.name);
                                // Navigate to tab route structure with clear intent
                                navigation.navigate("AdminNav", {
                                    screen: "AdminTabsRoute",
                                    params: { screen: route.name },
                                });
                            }}
                        >
                            <MaterialIcon
                                name={route.icon}
                                size={22}
                                color={curr === route.name ? "#007aff" : "#555"}
                                style={{ marginRight: 12 }}
                            />
                            <Text style={[
                                styles.itemText,
                                curr === route.name && styles.activeItemText
                            ]}>
                                {route.name}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {drawerRoutes.length > 0 && (
                        <>
                            <Divider style={[globalStyles.divider, styles.sectionDivider]} />
                            <Text style={styles.sectionTitle}>Management</Text>

                            {/* Drawer Navigations */}
                            {drawerRoutes.map((route) => !route.hidden && (
                                <TouchableOpacity
                                    key={route.name}
                                    style={[
                                        navigationStyles.drawerItem,
                                        curr === route.name && styles.activeItem,
                                        globalStyles.row
                                    ]}
                                    onPress={() => {
                                        setCurr(route.name);
                                        // Navigate to management route structure
                                        navigation.navigate("AdminNav", {
                                            screen: "AdminRoutesStack",
                                            params: { screen: route.name },
                                        });
                                    }}
                                >
                                    <MaterialIcon
                                        name={route.icon}
                                        size={22}
                                        color={curr === route.name ? "#007aff" : "#555"}
                                        style={{ marginRight: 12 }}
                                    />
                                    <Text style={[
                                        styles.itemText,
                                        curr === route.name && styles.activeItemText
                                    ]}>
                                        {route.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    {/* Return to Regular User Mode */}
                    <Divider style={[globalStyles.divider, styles.sectionDivider]} />
                    <TouchableOpacity
                        style={[navigationStyles.drawerItem, globalStyles.row]}
                        onPress={() => navigation.navigate('DefaultNav')}
                    >
                        <MaterialIcon
                            name="swap-horiz"
                            size={22}
                            color="#555"
                            style={{ marginRight: 12 }}
                        />
                        <Text style={styles.itemText}>
                            Switch to User Mode
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.scrollPadding} />
            </ScrollView>

            {/* Admin Footer with Logout */}
            <View style={navigationStyles.drawerFooter}>
                <Divider style={globalStyles.divider} />
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={logout}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                    ) : (
                        <Icon name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
                    )}
                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Existing styles remain unchanged
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#007aff',
        marginLeft: 8,
    },
    logoImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },
    userInfo: {
        alignItems: 'center',
    },
    avatar: {
        marginBottom: 8,
        backgroundColor: '#007aff',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userRole: {
        fontSize: 14,
        color: '#666',
    },
    userEmail: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollPadding: {
        height: 20, // Add some bottom padding to ensure all items are visible when scrolled
    },
    activeItem: {
        backgroundColor: '#f0f4ff',
        borderLeftWidth: 3,
        borderLeftColor: '#007aff',
    },
    itemText: {
        fontSize: 15,
        color: '#555',
    },
    activeItemText: {
        color: '#007aff',
        fontWeight: '500',
    },
    sectionDivider: {
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
        marginLeft: 16,
        marginBottom: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginTop: 8,
        marginBottom: 8,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 16,
    }
});