import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '~/styles/global';
import useAuth from '~/hooks/useAuth';
import LoadingScreen from '~/screens/LoadingScreen';

export function GuestLayout({
    children,
    allowAuthenticated = false,
    redirectAuthenticated = 'DefaultNav'
}) {
    const navigation = useNavigation();
    const { isAuthenticated, isReady } = useAuth();

    // Redirect authenticated users if not explicitly allowed
    useEffect(() => {
        if (isReady && isAuthenticated && !allowAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: redirectAuthenticated }],
            });
        }
    }, [isAuthenticated, isReady, allowAuthenticated, redirectAuthenticated, navigation]);

    // Show loading while auth state is being determined
    if (!isReady) {
        return <LoadingScreen />
    }

    // If guest or explicitly allowing authenticated users, render children
    return (!isAuthenticated || allowAuthenticated) ? <>{children}</> : null;
}