import React from 'react';
import * as Screens from '~/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultOptions } from './_options';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import {
    BasicInformation,
    AddressInformation,
    EmailVerification,
    Login,
    Register,
} from '~/screens/Auth';
import { useGuestRoute } from '~/contexts/AuthContext';
import CustomHeader from '../headers/CustomHeader';

const Stack = createStackNavigator();
const GUEST_DEFAULT = 'Login';

// Custom header options function
const getCustomHeaderOptions = (title, showBackButton = true) => ({
    headerShown: true,
    header: ({ navigation, route }) => (
        <CustomHeader
            showBackButton={showBackButton}
        />
    ),
    headerLeft: () => null, // This prevents the default back button
});

export const guestRoutes = () => [
    // Authentication routes
    {
        name: 'Login',
        component: Login,
        icon: 'login',
        options: {
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                <Icon name="login" color={color} size={size} />
            ),
        },
    },
    {
        name: 'Register',
        component: Register,
        icon: 'person-add',
        options: {
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                <Icon name="person-add" color={color} size={size} />
            ),
        },
    },

    // Onboarding routes (need to be accessible by authenticated users)
    {
        name: 'BasicInformation',
        component: BasicInformation,
        options: {
            ...getCustomHeaderOptions('Basic Information', false),
            gestureEnabled: false,
        }
    },
    {
        name: 'AddressInformation',
        component: AddressInformation,
        options: {
            ...getCustomHeaderOptions('Address Information'),
        }
    },
    {
        name: 'EmailVerification',
        component: EmailVerification,
        options: {
            ...getCustomHeaderOptions('Verify Your Email'),
        }
    },

    // Guest browsing routes
    {
        name: 'Home',
        component: Screens.Home,
        icon: 'home',
        options: {
            ...getCustomHeaderOptions('Home', false),
            tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
            ),
        },
    },
];

export function GuestNav({ initialRouteName = GUEST_DEFAULT }) {
    // We allow authenticated users because onboarding happens in guest nav
    useGuestRoute(true);

    const routes = guestRoutes();

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                ...defaultOptions,
                gestureEnabled: true, // Enable gesture navigation by default
            }}
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
        </Stack.Navigator>
    );
}
