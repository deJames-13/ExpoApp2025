import React, { useEffect } from 'react';
import useAuth from '~/hooks/useAuth';
import LoadingScreen from '~/screens/LoadingScreen';
import { logProtectedLayoutStatus } from '~/utils/logUtils';

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
        currentUser,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isPendingVerification,
        isAdmin,
        userHasCompletedProfile,
        userHasVerifiedEmail
    } = useAuth({
        requireAuth: true,
        // Use actual profile data from user object to determine if onboarding is needed
        requireBasicInfo: requireBasicInfo && !userHasCompletedProfile,
        requireAddressInfo: requireAddressInfo && !userHasCompletedProfile,
        requireEmailVerified: requireEmailVerified && !userHasVerifiedEmail && !isPendingVerification,
        requireAdmin
    });

    // Debug user profile information at layout level
    useEffect(() => {
        if (currentUser) {
            logProtectedLayoutStatus(
                currentUser,
                userHasCompletedProfile,
                userHasVerifiedEmail,
                isPendingVerification
            );
        }
    }, [currentUser, userHasCompletedProfile, userHasVerifiedEmail, isPendingVerification]);

    // Show loading while auth state is being determined
    if (!isReady) {
        return <LoadingScreen />;
    }

    // Authentication check
    if (!isAuthenticated) {
        return null;
    }

    // Admin check if required
    if (requireAdmin && !isAdmin) {
        return null;
    }

    // Check if user has completed profile directly from user data
    const profileComplete = userHasCompletedProfile || (hasBasicInfo && hasAddressInfo);

    // Check if email is verified or pending verification
    const emailVerificationComplete = userHasVerifiedEmail || isEmailVerified || isPendingVerification;

    // Onboarding checks with prioritization of data from user object
    if (requireBasicInfo && !profileComplete) {
        return null;
    }

    if (requireAddressInfo && !profileComplete) {
        return null;
    }

    if (requireEmailVerified && !emailVerificationComplete) {
        return null;
    }

    // All requirements met, render children
    return <>{children}</>;
}