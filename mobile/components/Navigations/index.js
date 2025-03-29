import React, { useEffect } from 'react';
import { DefaultNav, GuestNav, AdminNav } from './routes';
import { createStackNavigator } from '@react-navigation/stack';
import useFirebaseMessaging from "~/firebase/useFirebaseMessaging";
import useCheckConnection from '~/hooks/useCheckConnection';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import CategorizedProducts from '~/screens/Home/components/CategorizedProducts';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/states/slices/auth';

const Stack = createStackNavigator();

export default function MainNav({ initialRouteName }) {
    useFirebaseMessaging();
    useCheckConnection();
    const currentUser = useSelector(selectCurrentUser);

    // Determine initial route based on user role
    const determineInitialRoute = () => {
        if (!initialRouteName) {
            if (!currentUser) {
                return 'GuestNav';
            } else if (currentUser.role === 'ADMIN') {
                return 'AdminNav';
            } else {
                return 'DefaultNav';
            }
        }
        return initialRouteName;
    };

    return (
        <Stack.Navigator
            initialRouteName={determineInitialRoute()}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="DefaultNav"
                component={DefaultNav}
            />
            <Stack.Screen
                name="GuestNav"
                component={GuestNav}
            />
            <Stack.Screen
                name="AdminNav"
                component={AdminNav}
            />
            <Stack.Screen
                name="ProductDetailView"
                component={ProductDetailView}
            />
            <Stack.Screen
                name="CategorizedProducts"
                component={CategorizedProducts}
            />
        </Stack.Navigator>
    )
}