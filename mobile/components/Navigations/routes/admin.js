import * as AdminScreens from '~/admin/screens';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { defaultOptions } from './_options';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminDrawerContent } from '../drawers/admin-content';
import { tabRoutes, adminRoutes } from './_admin-routes';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ADMIN_DEFAULT = 'Dashboard';

function AdminTabStack() {
    const routes = tabRoutes();
    return (
        <Tab.Navigator
            initialRouteName={ADMIN_DEFAULT}
            screenOptions={defaultOptions}
        >
            {routes.map((route) => route?.isTab && (
                <Tab.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={route.options}
                />
            ))}
        </Tab.Navigator>
    );
}

// Stack for admin management routes
function AdminRoutesStack() {
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

// Main Admin Navigation setup
export function AdminNav() {
    return (
        <Drawer.Navigator
            drawerContent={props => <AdminDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                headerTitle: 'EyeZone Admin',
                drawerStyle: { width: 280 },
                swipeEdgeWidth: 100,
            }}
        >
            <Drawer.Screen
                name="AdminTabsRoute"
                component={AdminTabStack}
                options={{
                    title: 'Admin Dashboard'
                }}
            />
            <Drawer.Screen
                name="AdminRoutesStack"
                component={AdminRoutesStack}
                options={{
                    title: 'Admin Management'
                }}
            />
        </Drawer.Navigator>
    );
}

// Export the routes for use elsewhere
export { adminRoutes } from './_admin-routes';

