import * as Screens from '~/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
export { defaultOptions } from './_options';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultOptions } from './_options';


const Stack = createStackNavigator();
const GUEST_DEFAULT = 'Onboarding';


export const guestRoutes = () => [
    {
        name: 'Onboarding',
        component: Screens.Onboarding,
    },
    {
        name: 'Home',
        component: Screens.Home,
    },
    {
        name: 'Login',
        component: Screens.Login,
        icon: 'person',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="person" color={color} size={size} />
            ),
        },
    },
    {
        name: 'Register',
        component: Screens.Register,
        icon: 'person',
        options: {
            tabBarIcon: ({ color, size }) => (
                <Icon name="person" color={color} size={size} />
            ),
        },
    },
];


export function GuestNav({ initialRouteName = GUEST_DEFAULT }) {
    const routes = guestRoutes();
    return (
        <Stack.Navigator
            initialRouteName={initialRouteName || routes.length > 0 && routes[0]?.name}
            screenOptions={defaultOptions}
        >
            {routes.map((route) => (
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
