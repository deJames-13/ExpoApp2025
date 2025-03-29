import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Divider, ActivityIndicator, Avatar } from 'react-native-paper';
import { defaultRoutes, tabRoutes } from '../routes/_default-routes';
import { globalStyles } from '~/styles/global';
import { getIconForRoute } from '~/utils/iconHelper';
import navigationStyles from '~/styles/navigationStyles';
import useAuth from '~/hooks/useAuth';
import useLogout from '~/hooks/useLogout';

export function DefaultDrawerContent() {
    const [curr, setCurr] = React.useState('Home');
    const navigation = useNavigation();
    const { isAuthenticated, currentUser } = useAuth();
    const { logout, isLoading } = useLogout();
    const drawerRoutes = defaultRoutes();
    const tabbedRoutes = tabRoutes();

    // Extract user information
    const userAvatar = currentUser?.info?.avatar;
    const userPhotoUrl = currentUser?.info?.photoUrl;
    const firstName = currentUser?.info?.first_name || '';
    const lastName = currentUser?.info?.last_name || '';
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : currentUser?.username || 'User';
    const email = currentUser?.email || '';

    // Determine which image source to use
    let userProfileImage = null;
    if (userAvatar?.url) {
        userProfileImage = userAvatar.url;
    } else if (userPhotoUrl) {
        userProfileImage = userPhotoUrl;
    }

    return (
        <SafeAreaView style={[navigationStyles.drawerContainer, styles.container]}>
            {/* Header with user info */}
            <View style={styles.drawerHeader}>
                <View style={globalStyles.row}>
                    <Image
                        source={require('~/assets/icon.png')}
                        style={styles.logoImage}
                    />
                    <Text style={[navigationStyles.drawerLogo, { marginLeft: 8 }]}>
                        EyeZ*ne
                    </Text>
                </View>

                {isAuthenticated && currentUser && (
                    <View style={styles.userInfoContainer}>
                        {userProfileImage ? (
                            <Image
                                source={{ uri: userProfileImage }}
                                style={styles.userAvatar}
                                onError={() => console.log('Failed to load user avatar')}
                            />
                        ) : (
                            <Avatar.Text
                                size={60}
                                label={fullName.substring(0, 2).toUpperCase()}
                                style={styles.avatarFallback}
                            />
                        )}
                        <Text style={styles.userName}>{fullName}</Text>
                        <Text style={styles.userEmail}>{email}</Text>
                        {currentUser.username && currentUser.username !== firstName && (
                            <Text style={styles.userUsername}>@{currentUser.username}</Text>
                        )}
                    </View>
                )}
            </View>

            <Divider style={[globalStyles.divider, styles.divider]} />

            {/* Scrollable drawer items */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={navigationStyles.drawerItemsContainer}>
                    {/* Tabbed Navigations */}
                    {tabbedRoutes.filter(route => !route.excludeInDrawer).map((route) => (
                        <TouchableOpacity
                            key={route.name}
                            style={[
                                navigationStyles.drawerItem,
                                curr === route.name && navigationStyles.drawerItemActive,
                                globalStyles.row
                            ]}
                            onPress={() => {
                                setCurr(route.name);
                                navigation.navigate("DefaultNav", {
                                    screen: "TabsRoute",
                                    params: { screen: route.name },
                                });
                            }}
                        >
                            <Icon
                                name={getIconForRoute(route.name)}
                                size={22}
                                color={curr === route.name ? navigationStyles.drawerItemTextActive.color : navigationStyles.drawerItemText.color}
                                style={{ marginRight: 12 }}
                            />
                            <Text style={[
                                navigationStyles.drawerItemText,
                                curr === route.name && navigationStyles.drawerItemTextActive
                            ]}>
                                {route.name}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {/* Drawer Navigations */}
                    {drawerRoutes.map((route) => route.icon && (
                        <TouchableOpacity
                            key={route.name}
                            style={[
                                navigationStyles.drawerItem,
                                curr === route.name && navigationStyles.drawerItemActive,
                                globalStyles.row
                            ]}
                            onPress={() => {
                                setCurr(route.name);
                                navigation.navigate("DefaultNav", {
                                    screen: "DefaultRoutes",
                                    params: { screen: route.name },
                                });
                            }}
                        >
                            <Icon
                                name={getIconForRoute(route.name)}
                                size={22}
                                color={curr === route.name ? navigationStyles.drawerItemTextActive.color : navigationStyles.drawerItemText.color}
                                style={{ marginRight: 12 }}
                            />
                            <Text style={[
                                navigationStyles.drawerItemText,
                                curr === route.name && navigationStyles.drawerItemTextActive
                            ]}>
                                {route.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <Divider style={[globalStyles.divider, styles.footerDivider]} />

            <View style={navigationStyles.drawerFooter}>
                {isAuthenticated ? (
                    <TouchableOpacity
                        style={[navigationStyles.logoutButton, globalStyles.row, { justifyContent: 'center' }]}
                        onPress={logout}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#000" style={{ marginRight: 8 }} />
                        ) : (
                            <Icon name="logout" size={20} color={navigationStyles.logoutText.color} style={{ marginRight: 8 }} />
                        )}
                        <Text style={navigationStyles.logoutText}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[navigationStyles.loginButton, globalStyles.row, { justifyContent: 'center' }]}
                        onPress={() => {
                            navigation.navigate("GuestNav", {
                                screen: 'Login',
                            });
                        }}
                    >
                        <Icon name="login" size={20} color={navigationStyles.loginText.color} style={{ marginRight: 8 }} />
                        <Text style={navigationStyles.loginText}>
                            Login
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerHeader: {
        paddingVertical: 18,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
    },
    logoImage: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },
    userInfoContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    avatarFallback: {
        backgroundColor: '#007aff',
        marginBottom: 10,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
        textAlign: 'center',
    },
    userUsername: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20, // Adds padding at the bottom to ensure all items are visible
    },
    divider: {
        marginTop: 0,
    },
    footerDivider: {
        marginBottom: 8,
    }
});