import React from 'react';
import { DefaultNav, GuestNav, AdminNav } from './routes';
import { createStackNavigator } from '@react-navigation/stack';
import useFirebaseMessaging from "~/firebase/useFirebaseMessaging";
import useCheckConnection from '~/hooks/useCheckConnection';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import CategorizedProducts from '~/screens/Home/components/CategorizedProducts';

const Stack = createStackNavigator();

export default function MainNav({ initialRouteName }) {
    useFirebaseMessaging();
    useCheckConnection();

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName || 'DefaultNav'}
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