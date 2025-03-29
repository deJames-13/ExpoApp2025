import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Divider, Avatar } from 'react-native-paper';
import { tabRoutes, adminRoutes } from '../routes/_admin-routes';
import { globalStyles } from '~/styles/global';
import navigationStyles from '~/styles/navigationStyles';

export function AdminDrawerContent() {
    const [curr, setCurr] = React.useState('Home');
    const navigation = useNavigation();
    const drawerRoutes = adminRoutes();
    const tabbedRoutes = tabRoutes();

    return (
        <SafeAreaView style={[navigationStyles.drawerContainer, styles.container]}>
            <View style={[navigationStyles.drawerHeader, styles.header]}>
                <View style={[globalStyles.row, styles.logoContainer]}>
                    <Icon name="eye-outline" size={32} color="#007aff" />
                    <Text style={styles.logoText}>
                        EyeZone Admin
                    </Text>
                </View>
                <View style={styles.userInfo}>
                    <Avatar.Text
                        size={50}
                        label="AU"
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>Admin User</Text>
                    <Text style={styles.userRole}>Administrator</Text>
                </View>
            </View>

            <Divider style={globalStyles.divider} />

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
                                // Navigate to tab route structure
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

                    <Divider style={[globalStyles.divider, styles.sectionDivider]} />
                    <Text style={styles.sectionTitle}>Management</Text>

                    {/* Drawer Navigations */}
                    {drawerRoutes.map((route) => (
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
                </View>
                <View style={styles.scrollPadding} />
            </ScrollView>

            <View style={navigationStyles.drawerFooter}>
                <Divider style={globalStyles.divider} />
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        navigation.navigate("GuestNav", {
                            screen: 'Login',
                        });
                    }}
                >
                    <Icon name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

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