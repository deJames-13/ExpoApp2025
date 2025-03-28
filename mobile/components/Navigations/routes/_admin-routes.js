import * as AdminScreens from '~/admin/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const tabRoutes = () => [
    {
        name: 'Home',
        component: AdminScreens.Home,
        icon: 'home',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
            ),
        },
        isTab: true,
    },
    {
        name: 'Dashboard',
        component: AdminScreens.Dashboard,
        icon: 'dashboard',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="dashboard" color={color} size={size} />
            ),
        },
        isTab: true,
    },
    // {
    //     name: 'Products',
    //     component: AdminScreens.Products,
    //     icon: 'shopping-bag',
    //     options: {
    //         tabBarIcon: ({ color, size }) => (
    //             <Icon name="shopping-bag" color={color} size={size} />
    //         ),
    //     },
    //     isTab: true,
    // },
];

export const adminRoutes = () => [
    // {
    //     name: 'Orders',
    //     component: AdminScreens.Orders,
    //     icon: 'receipt',
    //     options: {
    //         tabBarIcon: ({ color, size }) => (
    //             <Icon name="receipt" color={color} size={size} />
    //         ),
    //     },
    // },
    // {
    //     name: 'Users',
    //     component: AdminScreens.Users,
    //     icon: 'people',
    //     options: {
    //         tabBarIcon: ({ color, size }) => (
    //             <Icon name="people" color={color} size={size} />
    //         ),
    //     },
    // },
    // {
    //     name: 'Feedbacks',
    //     component: AdminScreens.Feedbacks,
    //     icon: 'feedback',
    //     options: {
    //         tabBarIcon: ({ color, size }) => (
    //             <Icon name="feedback" color={color} size={size} />
    //         ),
    //     },
    // },
    // {
    //     name: 'Account',
    //     component: AdminScreens.AdminAccount,
    //     icon: 'account-circle',
    //     options: {
    //         tabBarIcon: ({ color, size }) => (
    //             <Icon name="account-circle" color={color} size={size} />
    //         ),
    //     },
    // },
];

