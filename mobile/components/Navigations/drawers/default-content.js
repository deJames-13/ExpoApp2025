import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Divider, ActivityIndicator } from 'react-native-paper';
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

    return (
        <SafeAreaView style={navigationStyles.drawerContainer}>
            <View style={navigationStyles.drawerHeader}>
                <View style={globalStyles.row}>
                    <Icon name="eye-outline" size={28} color={navigationStyles.drawerLogo.color} />
                    <Text style={[navigationStyles.drawerLogo, { marginLeft: 8 }]}>
                        EyeZ*ne
                    </Text>
                </View>

                {/* {isAuthenticated && currentUser && (
                    <View style={navigationStyles.userInfoContainer}>
                        <Text style={navigationStyles.userNameText}>
                            {currentUser?.username || 'User'}
                        </Text>
                        <Text style={navigationStyles.userEmailText}>
                            {currentUser?.email || ''}
                        </Text>
                    </View>
                )} */}
            </View>

            <Divider style={globalStyles.divider} />

            <View style={navigationStyles.drawerItemsContainer}>
                {/* Tabbed Navigations */}
                {tabbedRoutes.map((route) => (
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

            <Divider style={globalStyles.divider} />

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