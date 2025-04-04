import * as AdminScreens from '~/admin/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const tabRoutes = () => [
];

export const adminRoutes = () => [
    {
        name: 'Dashboard',
        component: AdminScreens.Dashboard,
        icon: 'dashboard',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="dashboard" color={color} size={size} />
            ),
        },
        isTab: false,
    },
    {
        name: 'Account',
        component: AdminScreens.AdminAccount,
        icon: 'account-circle',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="account-circle" color={color} size={size} />
            ),
        },
        isTab: false,
    },
    {
        name: 'Products',
        component: AdminScreens.Products,
        icon: 'shopping-bag',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="shopping-bag" color={color} size={size} />
            ),
        },
        isTab: true,
    },
    {
        name: 'Orders',
        component: AdminScreens.Orders,
        icon: 'receipt',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="receipt" color={color} size={size} />
            ),
        },
        isTab: true,
    },
    {
        name: 'AdminOrderDetail',
        component: AdminScreens.OrderDetailView,
        icon: 'receipt',
        options: {
            headerShown: false,
            title: 'Order Details',
        },
        hidden: true,
    },
    {
        name: 'Notifications',
        component: AdminScreens.AdminNotifications,
        icon: 'notifications',
        options: {
            title: 'Send Notifications',
            headerShown: true,
        },
    },
    {
        name: 'Users',
        component: AdminScreens.UsersScreen,
        icon: 'people',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="people" color={color} size={size} />
            ),
        },
        isTab: false,
    },
    {
        name: 'Reviews',
        component: AdminScreens.Reviews,
        icon: 'rate-review',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="rate-review" color={color} size={size} />
            ),
        },
        isTab: false,
    },
    {
        name: 'AdminEditProfile',
        component: AdminScreens.AdminEditProfile,
        icon: 'edit',
        options: {
            title: 'Edit Profile',
            headerShown: false,
        },
        hidden: true,
    },
    {
        name: 'AdminSupport',
        component: AdminScreens.AdminSupport,
        icon: 'help',
        options: {
            title: 'Help & Support',
            headerShown: false,
        },
        hidden: true,
    },
];

