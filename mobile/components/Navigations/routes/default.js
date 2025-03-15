import * as Screens from '~/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultDrawerContent } from '../drawers/default-content';
import { defaultOptions } from './_options';

const USER_DEFAULT = 'Home';
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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
        icon: 'cart',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="cart" color={color} size={size} />
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


const DefaultTabs = ({ initialRouteName = USER_DEFAULT }) => {
    const routes = tabRoutes();

    return (
        <>
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

        </>
    )
}

export function DefaultRoutes() {
    return (
        <Stack.Navigator
            screenOptions={defaultOptions}
        >
            {defaultRoutes().map((route) => (
                <Stack.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={route.options}
                />
            ))}
        </Stack.Navigator>
    );
}

export function DefaultNav() {
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
