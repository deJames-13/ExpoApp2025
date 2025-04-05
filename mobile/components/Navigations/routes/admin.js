import React, { useEffect } from 'react';
import * as AdminScreens from '~/admin/screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { defaultOptions } from './_options';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminDrawerContent } from '../drawers/admin-content';
import { tabRoutes, adminRoutes } from './_admin-routes';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import { useAdminRoute } from '~/contexts/AuthContext';
import { View, ActivityIndicator, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { globalStyles } from '~/styles/global';
import LoadingScreen from '~/screens/LoadingScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Custom Admin Header Component
const CustomAdminHeader = ({ navigation }) => {
    const { currentAdminUser } = useAdminRoute();

    // Get admin avatar from user info
    const adminAvatar = currentAdminUser?.avatar;
    const adminPhotoUrl = currentAdminUser?.photoUrl;

    // Determine which image source to use
    let adminProfileImage = null;

    if (adminAvatar?.url) {
        adminProfileImage = adminAvatar.url;
    } else if (adminPhotoUrl) {
        adminProfileImage = adminPhotoUrl;
    }

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.openDrawer()}
            >
                <Icon name="menu" size={26} color="#333" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
                Dashboard
            </Text>

            <View style={styles.rightIcons}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('AdminRoutesStack', { screen: 'AdminNotifications' })}
                >
                    <Icon name="notifications" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('AdminRoutesStack', { screen: 'AdminSettings' })}
                >
                    <Icon name="settings" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('AdminRoutesStack', { screen: 'AdminProfile' })}
                >
                    {adminProfileImage ? (
                        <Image
                            source={{ uri: adminProfileImage }}
                            style={styles.userIcon}
                            onError={() => console.log('Failed to load admin avatar')}
                        />
                    ) : (
                        <Icon name="person" size={24} color="#333" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles for the admin header
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
    },
    menuButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 20,
        padding: 4,
    },
    userIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ADMIN_DEFAULT = 'Dashboard';

function AdminTabStack() {
    const routes = tabRoutes();
    return (
        <Tab.Navigator
            initialRouteName={ADMIN_DEFAULT}
            screenOptions={defaultOptions}
        >
            {routes.map((route) => route?.isTab && (
                <Tab.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={route.options}
                />
            ))}
        </Tab.Navigator>
    );
}

// Stack for admin management routes
function AdminRoutesStack() {
    const routes = adminRoutes();
    return (
        <Stack.Navigator screenOptions={defaultOptions}>
            {routes.map((route) => (
                <Stack.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={route.options}
                />
            ))}
            <Stack.Screen
                name="ProductDetailView"
                component={ProductDetailView}
                options={{ headerShown: false }}
            />
        
        </Stack.Navigator>
    );
}

// Main Admin Navigation setup with enhanced validation
export function AdminNav() {
    const { isAuthorizedAdmin, currentAdminUser } = useAdminRoute();
    const [isLoading, setIsLoading] = React.useState(true);

    // Add a loading effect for better UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Enhanced admin check with proper loading state
    if (isLoading) {
        return <LoadingScreen message="Loading admin panel..." />;
    }

    if (!isAuthorizedAdmin) {
        return (
            <View style={[globalStyles.container, globalStyles.centered]}>
                <ActivityIndicator size="large" color="#007aff" />
                <Text style={{ marginTop: 20, textAlign: 'center' }}>
                    Verifying admin access...
                </Text>
            </View>
        );
    }

    return (
        <Drawer.Navigator
            drawerContent={props => <AdminDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                header: ({ navigation }) => <CustomAdminHeader navigation={navigation} />,
                drawerStyle: { width: 280 },
                swipeEdgeWidth: 100,
            }}
        >
            <Drawer.Screen
                name="AdminTabsRoute"
                component={AdminTabStack}
                options={{
                    title: 'Admin Dashboard'
                }}
            />
            <Drawer.Screen
                name="AdminRoutesStack"
                component={AdminRoutesStack}
                options={{
                    title: 'Admin Management'
                }}
            />
        </Drawer.Navigator>
    );
}

// Export the routes for use elsewhere
export { adminRoutes } from './_admin-routes';

