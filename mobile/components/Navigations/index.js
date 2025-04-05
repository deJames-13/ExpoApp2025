import React, { useState, useEffect } from 'react';
import { DefaultNav, GuestNav, AdminNav, HttpErrorView } from './routes';
import { createStackNavigator } from '@react-navigation/stack';
import useCheckConnection from '~/hooks/useCheckConnection';
import { useAuthContext } from '~/contexts/AuthContext';
import ProductDetailView from '~/screens/Home/components/ProductDetailView';
import CategorizedProducts from '~/screens/Home/components/CategorizedProducts';
import LoadingScreen from '~/screens/LoadingScreen';

const Stack = createStackNavigator();

function determineInitialRoute(isAuthenticated, isAdmin) {
    if (!isAuthenticated) {
        return 'GuestNav';
    }

    if (isAdmin) {
        return 'AdminNav';
    }

    return 'DefaultNav';
}
export default function MainNav() {
    useCheckConnection();
    const [isInitialized, setIsInitialized] = useState(false);
    const auth = useAuthContext();
    const { isAuthenticated, isAdmin, isReady } = auth || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialized(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!isInitialized || !isReady) {
        return <LoadingScreen />;
    }

    const initialRoute = determineInitialRoute(isAuthenticated, isAdmin);

    // Make sure routes are properly ordered for the navigation stack
    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="DefaultNav" component={DefaultNav} />
            <Stack.Screen name="GuestNav" component={GuestNav} />
            <Stack.Screen name="AdminNav" component={AdminNav} />
            <Stack.Screen name="ProductDetailView" component={ProductDetailView} />
            <Stack.Screen name="CategorizedProducts" component={CategorizedProducts} />
            <Stack.Screen
                name="ErrorScreen"
                component={HttpErrorView}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
