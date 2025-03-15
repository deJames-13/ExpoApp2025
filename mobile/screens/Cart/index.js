import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CartPage } from './CartPage';
import CartDetailView from './CartDetailView';

const Stack = createStackNavigator();

const CartScreen = () => {
    return (
        <Stack.Navigator
            initialRouteName="CartPage"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="CartPage"
                component={CartPage}
            />
            <Stack.Screen
                name="CartDetailView"
                component={CartDetailView}
                options={{
                    presentation: 'card',
                    animationEnabled: true,
                }}
            />
        </Stack.Navigator>
    );
};

export { CartScreen };

