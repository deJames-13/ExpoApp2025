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
        name: 'Cart',
        component: Screens.CartScreen,
        icon: 'shopping-cart',  // Updated icon name for consistency
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="shopping-cart" color={color} size={size} />
            ),
        },
    },
    {
        name: 'Checkout',
        component: Screens.CheckoutScreen,
        // icon: 'credit-card',
        // options: {
        //     tabBarIcon: ({ color, size }) => (
        //         <Icon name="credit-card" color={color} size={size} />
        //     ),
        // },
    },
    {
        name: 'Orders',
        component: Screens.OrderScreen,
        icon: 'receipt', // Changed from 'cart' to 'receipt' for consistency
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
];

