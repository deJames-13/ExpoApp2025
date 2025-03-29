import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { globalStyles } from '~/styles/global';
import useAuth from '~/hooks/useAuth';
import { navigationRef } from '~/navigation/navigationService';
import LoadingScreen from '~/screens/LoadingScreen';

// Create contexts
const AuthContext = createContext(null);
const ProtectedContext = createContext(null);
const GuestContext = createContext(null);
const AdminContext = createContext(null);

/**
 * Main Auth Provider that provides authentication state to the entire app
 */
export function AuthProvider({ children }) {
    const [navigationReady, setNavigationReady] = useState(false);
    const checkNavTimeoutRef = useRef(null);
    const [waitTimeout, setWaitTimeout] = useState(false);
    const auth = useAuth();

    const {
        isAuthenticated,
        isReady,
        currentUser,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isAdmin,
        handleLogout,
        refreshToken,
        refetchProfile
    } = auth;

    // Wait for navigation to be ready, but with a timeout
    useEffect(() => {
        const checkNavReady = setInterval(() => {
            if (navigationRef.isReady()) {
                setNavigationReady(true);
                clearInterval(checkNavReady);
                if (checkNavTimeoutRef.current) {
                    clearTimeout(checkNavTimeoutRef.current);
                }
            }
        }, 100);

        // Set a timeout to prevent infinite waiting
        checkNavTimeoutRef.current = setTimeout(() => {
            clearInterval(checkNavReady);
            console.warn('Timed out waiting for navigation to be ready');
            setWaitTimeout(true);
            setNavigationReady(true); // Force proceed even if navigation isn't ready
        }, 3000); // 3 second timeout

        return () => {
            clearInterval(checkNavReady);
            if (checkNavTimeoutRef.current) {
                clearTimeout(checkNavTimeoutRef.current);
            }
        };
    }, []);

    // Only attempt navigation when both auth is ready and navigation is ready
    const attemptNavigation = () => {
        if (!navigationRef.isReady()) {
            console.log('Navigation not ready yet, skipping navigation');
            return;
        }

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
    };

    // Apply navigation logic using a more controlled approach
    useEffect(() => {
        if (isReady && navigationReady) {
            // Use a timeout to ensure we're not in the middle of a render cycle
            const timer = setTimeout(() => {
                attemptNavigation();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isReady, navigationReady, isAuthenticated, hasBasicInfo, hasAddressInfo, isEmailVerified, isAdmin]);

    // Force proceed after timeout or when ready
    if (!isReady && !waitTimeout) {
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider
            value={{
                ...auth,
                navigationReady: navigationReady || waitTimeout
            }}
        >
            <ProtectedContext.Provider
                value={{
                    isAuthenticated,
                    hasBasicInfo,
                    hasAddressInfo,
                    isEmailVerified,
                    isAdmin,
                    currentUser,
                    handleLogout,
                    refreshToken,
                    refetchProfile
                }}
            >
                <GuestContext.Provider
                    value={{
                        isAuthenticated,
                        currentUser
                    }}
                >
                    <AdminContext.Provider
                        value={{
                            isAuthenticated,
                            isAdmin,
                            currentUser,
                            handleLogout
                        }}
                    >
                        {children}
                    </AdminContext.Provider>
                </GuestContext.Provider>
            </ProtectedContext.Provider>
        </AuthContext.Provider>
    );
}

// Custom hooks to access the contexts
export const useAuthContext = () => useContext(AuthContext);
export const useProtectedContext = () => useContext(ProtectedContext);
export const useGuestContext = () => useContext(GuestContext);
export const useAdminContext = () => useContext(AdminContext);

// Utility hooks for common auth patterns
export function useProtectedRoute({
    requireBasicInfo = true,
    requireAddressInfo = true,
    requireEmailVerified = true,
    requireAdmin = false,
    redirectOnFail = true
} = {}) {
    const {
        isAuthenticated,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isAdmin,
        navigationReady
    } = useAuthContext();

    // Check if the user meets all requirements for this protected route
    const isAuthorized =
        isAuthenticated &&
        (!requireBasicInfo || hasBasicInfo) &&
        (!requireAddressInfo || hasAddressInfo) &&
        (!requireEmailVerified || isEmailVerified) &&
        (!requireAdmin || isAdmin);

    // Handle redirection if needed
    useEffect(() => {
        if (!navigationReady || !redirectOnFail) return;

        if (!isAuthenticated) {
            navigationRef.navigate('GuestNav', { screen: 'Login' });
            return;
        }

        if (requireBasicInfo && !hasBasicInfo) {
            navigationRef.navigate('GuestNav', { screen: 'BasicInformation' });
            return;
        }

        if (requireAddressInfo && !hasAddressInfo) {
            navigationRef.navigate('GuestNav', { screen: 'AddressInformation' });
            return;
        }

        if (requireEmailVerified && !isEmailVerified) {
            navigationRef.navigate('GuestNav', { screen: 'EmailVerification' });
            return;
        }

        if (requireAdmin && !isAdmin) {
            navigationRef.navigate('DefaultNav');
            return;
        }
    }, [
        isAuthenticated,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isAdmin,
        redirectOnFail,
        navigationReady
    ]);

    return { isAuthorized };
}

export function useGuestRoute(allowAuthenticated = false) {
    const { isAuthenticated, navigationReady } = useAuthContext();

    useEffect(() => {
        if (navigationReady && isAuthenticated && !allowAuthenticated) {
            navigationRef.navigate('DefaultNav');
        }
    }, [isAuthenticated, allowAuthenticated, navigationReady]);

    return { isGuest: !isAuthenticated || allowAuthenticated };
}

export function useAdminRoute() {
    const { isAuthenticated, isAdmin, navigationReady } = useAuthContext();

    useEffect(() => {
        if (!navigationReady) return;

        if (!isAuthenticated) {
            navigationRef.navigate('GuestNav', { screen: 'Login' });
            return;
        }

        if (!isAdmin) {
            navigationRef.navigate('DefaultNav');
            return;
        }
    }, [isAuthenticated, isAdmin, navigationReady]);

    return { isAuthorizedAdmin: isAuthenticated && isAdmin };
}
