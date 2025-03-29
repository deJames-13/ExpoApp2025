import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { globalStyles } from '~/styles/global';
import useAuth from '~/hooks/useAuth';
import { ProtectedLayout } from './ProtectedLayout';
import { GuestLayout } from './GuestLayout';
import { navigationRef } from '~/navigation/navigationService';

/**
 * Root layout component that determines which layout to use based on user auth state
 * 
 * This component will:
 * 1. Check authentication status
 * 2. Handle redirects based on onboarding state (basic info, address, email verification)
 * 3. Apply the appropriate layout (Guest, Protected, or Admin)
 */
export function RootLayout({ children }) {
    const [navigationReady, setNavigationReady] = useState(false);
    const {
        isAuthenticated,
        isReady,
        currentUser,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isAdmin
    } = useAuth();

    // Wait for navigation to be ready before attempting navigation
    useEffect(() => {
        const checkNavReady = setInterval(() => {
            if (navigationRef.isReady()) {
                setNavigationReady(true);
                clearInterval(checkNavReady);
            }
        }, 100);

        return () => clearInterval(checkNavReady);
    }, []);

    // Handle redirects based on authentication and onboarding state
    useEffect(() => {
        if (!isReady || !navigationReady) return;

        if (isAuthenticated) {
            // Check if user needs to complete onboarding
            if (!hasBasicInfo) {
                navigationRef.navigate('GuestNav', { screen: 'BasicInformation' });
                return;
            } else if (!hasAddressInfo) {
                navigationRef.navigate('GuestNav', { screen: 'AddressInformation' });
                return;
            } else if (!isEmailVerified) {
                navigationRef.navigate('GuestNav', { screen: 'EmailVerification' });
                return;
            }

            // If onboarding complete, check if admin
            if (isAdmin) {
                navigationRef.navigate('AdminNav');
            } else {
                navigationRef.navigate('DefaultNav');
            }
        } else {
            // Not authenticated
            navigationRef.navigate('GuestNav');
        }
    }, [isReady, navigationReady, isAuthenticated, hasBasicInfo, hasAddressInfo, isEmailVerified, isAdmin]);

    // Show loading while auth state is being determined
    if (!isReady || !navigationReady) {
        return (
            <View style={[globalStyles.container, globalStyles.centered]}>
                <ActivityIndicator size="large" color="#007aff" />
            </View>
        );
    }

    // Return the appropriate layout based on auth state
    if (!isAuthenticated) {
        return <GuestLayout>{children}</GuestLayout>;
    }

    // For authenticated users, use ProtectedLayout with appropriate requirements
    return (
        <ProtectedLayout
            requireBasicInfo={true}
            requireAddressInfo={true}
            requireEmailVerified={true}
            requireAdmin={isAdmin}
        >
            {children}
        </ProtectedLayout>
    );
}
