import * as Screens from '~/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const tabRoutes = () => [
    {
        name: 'Home',
        component: Screens.Home,
        icon: 'home',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
            ),
        },
        isTab: true,
    },
    {
        name: 'Search',
        component: Screens.SearchedScreen,
        icon: 'search',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="search" color={color} size={size} />
            ),
        },
        isTab: true,
        excludeInDrawer: true,
    },
];

export const defaultRoutes = () => [
    {
        name: 'Profile',
        component: Screens.Profile,
        icon: 'person',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="person" color={color} size={size} />
            ),
        },
    },
    {
        name: 'EditProfile',
        component: Screens.Profile.EditProfile,
        options: {
            headerShown: true,
            title: 'Edit Profile',
        },
    },
    {
        name: 'Cart',
        component: Screens.CartScreen,
        icon: 'shopping-cart',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="shopping-cart" color={color} size={size} />
            ),
        },
    },
    {
        name: 'CartDetailView',
        component: Screens.CartDetailView,
    },
    {
        name: 'Checkout',
        component: Screens.CheckoutScreen,
    },
    {
        name: 'OrderSuccess',
        component: Screens.OrderSuccess,
        // No icon needed as this is not a tab or drawer item
    },
    {
        name: 'Orders',
        component: Screens.OrderScreen,
        icon: 'receipt',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="receipt" color={color} size={size} />
            ),
        },
    },
    {
        name: 'Notifications',
        component: Screens.NotificationScreen,
        icon: 'notifications',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="notifications" color={color} size={size} />
            ),
        },
    },
    {
        name: 'Reviews',
        component: Screens.ReviewsScreen,
        icon: 'review',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="review" color={color} size={size} />
            ),
        },
    },
];

