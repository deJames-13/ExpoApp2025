import React from 'react';
import { DefaultNav, GuestNav, AdminNav } from './routes';
import { createStackNavigator } from '@react-navigation/stack';
import useFirebaseMessaging from "~/firebase/useFirebaseMessaging";
import useCheckConnection from '~/hooks/useCheckConnection';

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
        </Stack.Navigator>
    )
}