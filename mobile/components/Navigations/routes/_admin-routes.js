import * as AdminScreens from '~/admin/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductDetail from '~/admin/screens/Products/detail';

export const tabRoutes = () => [
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
    {
        name: 'Account',
        component: AdminScreens.AdminAccount,
        icon: 'account-circle',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="account-circle" color={color} size={size} />
            ),
        },
        isTab: true,
    },
];

export const adminRoutes = () => [
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
        name: 'ProductDetail',
        component: ProductDetail,
        icon: 'inventory',
        options: {
            headerShown: false,
            title: 'Product Details',
        },
        hidden: true,
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
];

