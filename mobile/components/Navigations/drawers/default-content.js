import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { defaultRoutes, tabRoutes } from '../routes/default';
import { globalStyles } from '../../../styles/global';
import navigationStyles from '../../../styles/navigationStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getIconForRoute } from '../../../utils/iconHelper';

export function DefaultDrawerContent() {
    const [curr, setCurr] = React.useState('Home');
    const [logged, setLogged] = React.useState(true);
    const navigation = useNavigation();
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
                {logged ? (
                    <TouchableOpacity
                        style={[navigationStyles.logoutButton, globalStyles.row, { justifyContent: 'center' }]}
                        onPress={() => {
                            setLogged(!logged);
                            navigation.navigate("GuestNav", {
                                screen: 'Login',
                            });
                        }}
                    >
                        <Icon name="logout" size={20} color={navigationStyles.logoutText.color} style={{ marginRight: 8 }} />
                        <Text style={navigationStyles.logoutText}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[navigationStyles.loginButton, globalStyles.row, { justifyContent: 'center' }]}
                        onPress={() => {
                            setLogged(!logged);
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