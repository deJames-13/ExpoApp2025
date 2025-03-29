import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
    selectIsAuthenticated,
    selectCurrentUser,
    selectAccessToken,
    selectHasBasicInfo,
    selectHasAddressInfo,
    selectIsEmailVerified,
    logout
} from '~/states/slices/auth';
import { useGetProfileQuery, useRefreshTokenQuery } from '~/states/api/auth';

export default function useAuth({
    requireAuth = false,
    requireBasicInfo = false,
    requireAddressInfo = false,
    requireEmailVerified = false,
    requireAdmin = false,
    redirectTo = null
} = {}) {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isReady, setIsReady] = useState(false);

    // Auth selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);
    const accessToken = useSelector(selectAccessToken);
    const hasBasicInfo = useSelector(selectHasBasicInfo);
    const hasAddressInfo = useSelector(selectHasAddressInfo);
    const isEmailVerified = useSelector(selectIsEmailVerified);

    // Check if user is admin
    const isAdmin = currentUser?.role === 'ADMIN';

    // Get latest profile data
    const { data: profileData, error: profileError, refetch: refetchProfile } =
        useGetProfileQuery(undefined, {
            skip: !isAuthenticated || !accessToken,
            refetchOnMountOrArgChange: true
        });

    // Token refresh hook - lazily loaded
    const [triggerRefreshToken, { isLoading: isRefreshing }] = useRefreshTokenQuery(undefined, {
        skip: true
    });

    const refreshToken = useCallback(async () => {
        try {
            const result = await triggerRefreshToken().unwrap();
            return !!result?.token;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return false;
        }
    }, [triggerRefreshToken]);

    // Validate requirements and redirect as needed
    const validateRequirements = useCallback(() => {
        if (!isReady) return false;

        // Check authentication
        if (requireAuth && !isAuthenticated) {
            navigation.navigate('GuestNav', { screen: 'Login' });
            return false;
        }

        // Check admin status
        if (requireAdmin && !isAdmin) {
            navigation.navigate('DefaultNav');
            return false;
        }

        if (isAuthenticated) {
            // Onboarding checks - in order of flow
            if (requireBasicInfo && !hasBasicInfo) {
                navigation.navigate('BasicInformation');
                return false;
            }

            if (requireAddressInfo && !hasAddressInfo) {
                navigation.navigate('AddressInformation');
                return false;
            }

            if (requireEmailVerified && !isEmailVerified) {
                navigation.navigate('EmailVerification');
                return false;
            }
        }

        return true;
    }, [
        isReady,
        isAuthenticated,
        isAdmin,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        requireAuth,
        requireAdmin,
        requireBasicInfo,
        requireAddressInfo,
        requireEmailVerified,
        navigation
    ]);

    // Check on first load and when dependencies change
    useEffect(() => {
        if (!isReady) {
            setIsReady(true);
            return;
        }

        // Validate and redirect if needed
        const isValid = validateRequirements();
        if (!isValid && redirectTo) {
            navigation.navigate(redirectTo);
        }
    }, [
        isReady,
        validateRequirements,
        redirectTo,
        navigation
    ]);

    // Handle token expiration and profile errors
    useEffect(() => {
        if (isAuthenticated &&
            (profileError?.status === 401 ||
                profileError?.status === 403 ||
                profileError?.status === 419)) {
            // Token expired, try to refresh
            refreshToken().then(success => {
                if (!success) {
                    // If refresh fails, log the user out
                    dispatch(logout());
                    navigation.navigate('GuestNav', { screen: 'Login' });
                }
            });
        }
    }, [profileError, refreshToken, dispatch, navigation, isAuthenticated]);

    return {
        isAuthenticated,
        currentUser,
        accessToken,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isAdmin,
        isReady,
        refreshToken,
        refetchProfile,
        validateRequirements,
        isRefreshing,
        handleLogout: () => {
            dispatch(logout());
            navigation.navigate('GuestNav', { screen: 'Login' });
        }
    };
}
