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
