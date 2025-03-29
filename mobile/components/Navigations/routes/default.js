import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultDrawerContent } from '../drawers';
import { defaultOptions } from './_options';
import { tabRoutes, defaultRoutes } from './_default-routes';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import CategorizedProducts from '~/screens/Home/components/CategorizedProducts';
import { useProtectedRoute } from '~/contexts/AuthContext';
import LoadingScreen from '~/screens/LoadingScreen';
import { useSelector } from 'react-redux';
import { selectIsEmailVerified } from '~/states/slices/auth';
import { EmailVerification } from '~/screens/Auth/Onboarding';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAuth from '~/hooks/useAuth';

// Custom Header Component
const CustomHeader = ({ navigation }) => {
    const { currentUser } = useAuth();

    // Get user avatar from user info
    const userAvatar = currentUser?.info?.avatar;
    const userPhotoUrl = currentUser?.info?.photoUrl;

    // Determine which image source to use
    let userProfileImage = null;

    if (userAvatar?.url) {
        userProfileImage = userAvatar.url;
    } else if (userPhotoUrl) {
        userProfileImage = userPhotoUrl;
    }

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.menuButton}
                onPress={() => navigation.openDrawer()}
            >
                <Icon name="menu" size={26} color="#333" />
            </TouchableOpacity>

            <View style={styles.rightIcons}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('DefaultRoutes', { screen: 'Orders' })}
                >
                    <Icon name="receipt" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('DefaultRoutes', { screen: 'Notifications' })}
                >
                    <Icon name="notifications" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('DefaultRoutes', { screen: 'Cart' })}
                >
                    <Icon name="shopping-cart" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('DefaultRoutes', { screen: 'Profile' })}
                >
                    {userProfileImage ? (
                        <Image
                            source={{ uri: userProfileImage }}
                            style={styles.userIcon}
                            // Add error handling for image loading failures
                            onError={() => console.log('Failed to load user avatar')}
                        />
                    ) : (
                        <Icon name="person" size={24} color="#333" />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Update styles with improved user icon styling
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

const USER_DEFAULT = 'Home';
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DefaultTabs = ({ initialRouteName = USER_DEFAULT }) => {
    const routes = tabRoutes();

    return (
        <Tabs.Navigator
            initialRouteName={initialRouteName || routes.length > 0 && routes[0]?.name || 'Home'}
            screenOptions={defaultOptions}
        >
            {routes.map((route) => route?.isTab && (
                <Tabs.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={route.options}
                />
            ))}
        </Tabs.Navigator>
    );
}

export function DefaultRoutes() {
    const routes = defaultRoutes();
    return (
        <Stack.Navigator
            screenOptions={defaultOptions}
        >
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
            <Stack.Screen
                name="CategorizedProducts"
                component={CategorizedProducts}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export function DefaultNav() {
    const { isAuthorized } = useProtectedRoute();
    const isEmailVerified = useSelector(selectIsEmailVerified);
    const [loading, setLoading] = useState(true);
    const [needsVerification, setNeedsVerification] = useState(false);

    useEffect(() => {
        const checkEmailVerification = async () => {
            try {
                const pendingVerification = await AsyncStorage.getItem('pendingEmailVerification');

                // If email is not verified and verification is pending, show verification screen
                if (!isEmailVerified && pendingVerification === 'true') {
                    setNeedsVerification(true);
                } else {
                    setNeedsVerification(false);
                }
            } catch (error) {
                console.error('Error checking email verification status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkEmailVerification();
    }, [isEmailVerified]);

    // Simplified auth check without blocking navigation
    if (!isAuthorized || loading) {
        return <LoadingScreen />;
    }

    // If email verification is pending, show email verification screen
    if (needsVerification) {
        return <EmailVerification />;
    }

    return (
        <Drawer.Navigator
            drawerContent={props => <DefaultDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                header: ({ navigation }) => <CustomHeader navigation={navigation} />,
                title: '',
            }}
        >
            <Drawer.Screen
                name="TabsRoute"
                component={DefaultTabs}
            />

            <Drawer.Screen
                name="DefaultRoutes"
                component={DefaultRoutes}
            />
        </Drawer.Navigator>
    );
}
