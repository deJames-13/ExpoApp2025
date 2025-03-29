import React, { useEffect } from 'react';
import useAuth from '~/hooks/useAuth';
import { navigationRef } from '~/navigation/navigationService';
import LoadingScreen from '~/screens/LoadingScreen';

/**
 * Admin layout component that ensures only admin users can access admin screens
 */
export function AdminLayout({ children }) {
    const { isAuthenticated, isReady, isAdmin } = useAuth();

    // Redirect non-admin users
    useEffect(() => {
        if (isReady && navigationRef.isReady()) {
            if (!isAuthenticated) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'GuestNav', params: { screen: 'Login' } }],
                });
            } else if (!isAdmin) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'DefaultNav' }],
                });
            }
        }
    }, [isReady, isAuthenticated, isAdmin]);

    // Show loading while checking auth state
    if (!isReady) {
        return <LoadingScreen />;
    }

    // Return null during redirects to prevent flashing content
    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    // Return children for authenticated admin users
    return <>{children}</>;
}

export default AdminLayout;