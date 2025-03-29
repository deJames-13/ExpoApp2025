import React from 'react';
import useAuth from '~/hooks/useAuth';
import LoadingScreen from '~/screens/LoadingScreen';

export function ProtectedLayout({
    children,
    requireBasicInfo = true,
    requireAddressInfo = true,
    requireEmailVerified = true,
    requireAdmin = false
}) {
    const {
        isAuthenticated,
        isReady,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isAdmin
    } = useAuth({
        requireAuth: true,
        requireBasicInfo,
        requireAddressInfo,
        requireEmailVerified,
        requireAdmin
    });

    // Show loading while auth state is being determined
    if (!isReady) {
        <LoadingScreen />
    }

    // Authentication check
    if (!isAuthenticated) {
        return null;
    }

    // Admin check if required
    if (requireAdmin && !isAdmin) {
        return null;
    }

    // Onboarding checks
    if (requireBasicInfo && !hasBasicInfo) {
        return null;
    }

    if (requireAddressInfo && !hasAddressInfo) {
        return null;
    }

    if (requireEmailVerified && !isEmailVerified) {
        return null;
    }

    // All requirements met, render children
    return <>{children}</>;
}