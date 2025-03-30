import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OrderPage } from './OrderPage';
import OrderDetailView from './OrderDetailView';

const Stack = createStackNavigator();

const OrderScreen = () => {
    return (
        <Stack.Navigator
            initialRouteName="OrderPage"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="OrderPage"
                component={OrderPage}
            />
            <Stack.Screen
                name="OrderDetailView"
                component={OrderDetailView}
                options={{
                    presentation: 'card',
                    animationEnabled: true,
                }}
            />
        </Stack.Navigator>
    );
};

export { OrderScreen };
export { default as OrderCard } from '../../components/Cards/order';