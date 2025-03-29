import * as Screens from '~/screens';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultOptions } from './_options';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import { GuestLayout } from '~/components/Layouts/GuestLayout';
import {
    BasicInformation,
    AddressInformation,
    EmailVerification
} from '~/screens/Auth/Onboarding';

const Stack = createStackNavigator();
const GUEST_DEFAULT = 'Login';

export const guestRoutes = () => [
    // Authentication routes
    {
        name: 'Login',
        component: Screens.Auth.Login,
        icon: 'login',
        options: {
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                <Icon name="login" color={color} size={size} />
            ),
        },
    },
    {
        name: 'Register',
        component: Screens.Auth.Register,
        icon: 'person-add',
        options: {
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                <Icon name="person-add" color={color} size={size} />
            ),
        },
    },

    // Onboarding routes (need to be accessible by authenticated users)
    {
        name: 'BasicInformation',
        component: BasicInformation,
        options: {
            title: 'Basic Information',
            headerShown: true
        }
    },
    {
        name: 'AddressInformation',
        component: AddressInformation,
        options: {
            title: 'Address Information',
            headerShown: true
        }
    },
    {
        name: 'EmailVerification',
        component: EmailVerification,
        options: {
            title: 'Verify Your Email',
            headerShown: true
        }
    },

    // Guest browsing routes
    {
        name: 'Home',
        component: Screens.Home,
        icon: 'home',
        options: {
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
            ),
        },
    },
];

export function GuestNav({ initialRouteName = GUEST_DEFAULT }) {
    const routes = guestRoutes();

    return (
        <GuestLayout allowAuthenticated={true}>
            <Stack.Navigator
                initialRouteName={initialRouteName}
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
                <Stack.Screen
                    name="ProductDetailView"
                    component={ProductDetailView}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </GuestLayout>
    );
}
