import * as Screens from '~/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { defaultOptions } from './_options';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const ADMIN_DEFAULT = 'AdminDashboard';

export const adminRoutes = () => [
    {
        name: 'Onboarding',
        component: Screens.Onboarding,
    },
    {
        name: 'Home',
        component: Screens.Home,
    },
    {
        name: 'Profile',
        component: Screens.Profile,
    },
];

// Create a stack navigator to handle admin routes and the product detail view
function AdminStack() {
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

export function AdminNav({ initialRouteName = ADMIN_DEFAULT }) {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="AdminStack"
                component={AdminStack}
            />
        </Drawer.Navigator>
    );
}
