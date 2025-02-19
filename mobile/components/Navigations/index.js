import React from 'react';
import { DefaultNav, GuestNav, AdminNav } from './routes';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();




export default function MainNav({ initialRouteName }) {
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