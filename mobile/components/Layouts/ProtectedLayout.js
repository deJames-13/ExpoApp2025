import React, { useEffect } from 'react';
import useAuth from '~/hooks/useAuth';
import LoadingScreen from '~/screens/LoadingScreen';
import { logProtectedLayoutStatus } from '~/utils/logUtils';
const LOG = false;

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
        requireBasicInfo: requireBasicInfo && !userHasCompletedProfile,
        requireAddressInfo: requireAddressInfo && !userHasCompletedProfile,
        requireEmailVerified: requireEmailVerified && !userHasVerifiedEmail && !isPendingVerification,
        requireAdmin
    });

    // Debug user profile information at layout level
    useEffect(() => {
        if (currentUser) {
            LOG && logProtectedLayoutStatus(
                currentUser,
                userHasCompletedProfile,
                userHasVerifiedEmail,
                isPendingVerification
            );
        }
    }, [currentUser, userHasCompletedProfile, userHasVerifiedEmail, isPendingVerification]);

    if (!isReady) {
        return <LoadingScreen />;
    }
    if (!isAuthenticated) {
        return null;
    }
    if (requireAdmin && !isAdmin) {
        return null;
    }

    const profileComplete = userHasCompletedProfile || (hasBasicInfo && hasAddressInfo);
    const emailVerificationComplete = userHasVerifiedEmail || isEmailVerified || isPendingVerification;
    if (requireBasicInfo && !profileComplete) {
        return null;
    }
    if (requireAddressInfo && !profileComplete) {
        return null;
    }
    if (requireEmailVerified && !emailVerificationComplete) {
        return null;
    }

    return <>{children}</>;
}