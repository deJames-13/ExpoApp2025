import * as Screens from '~/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { defaultOptions } from './_options';

const Drawer = createDrawerNavigator();
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


export function AdminNav({ initialRouteName = ADMIN_DEFAULT }) {
    const routes = adminRoutes();
    return (
        <Drawer.Navigator>
            {routes.map((route) => (
                <Drawer.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={route.options}
                />
            ))}
        </Drawer.Navigator>
    );
}
