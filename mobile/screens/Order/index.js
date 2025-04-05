import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OrderPage } from './OrderPage';
import OrderDetailView from './OrderDetailView';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const OrderScreen = ({ route, navigation }) => {
    // Check if we have any initial params from deep linking or notifications
    useEffect(() => {
        const initialParams = route.params;
        if (initialParams?.orderId) {
            // Navigate to order detail with the provided ID
            navigation.navigate('OrderDetailView', {
                orderId: initialParams.orderId
            });
        }
    }, [route.params, navigation]);

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