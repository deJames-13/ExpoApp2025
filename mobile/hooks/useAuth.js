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
    selectFcmToken,
    logout,
    hydrate
} from '~/states/slices/auth';
import { selectIsPendingVerification } from '~/states/slices/onboarding';
import { useGetProfileQuery, useRefreshTokenQuery } from '~/states/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, persistCredentials, clearCredentials } from '~/states/utils/authUtils';
import { logUserProfile } from '~/utils/logUtils';

export const useLoadUser = () => {
    const dispatch = useDispatch();
    const [isHydrated, setIsHydrated] = useState(false);

    // Load authentication state from AsyncStorage
    useEffect(() => {
        async function loadAuthState() {
            try {
                const [tokenValue, userValue, fcmTokenValue] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
                    AsyncStorage.getItem(STORAGE_KEYS.USER),
                    AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN)
                ]);

                if (tokenValue && userValue) {
                    const user = JSON.parse(userValue);
                    dispatch(hydrate({ token: tokenValue, user, fcmToken: fcmTokenValue }));
                }
            } catch (e) {
                console.error('Failed to load auth state:', e);
            } finally {
                setIsHydrated(true);
            }
        }

        loadAuthState();
    }, [dispatch]);

    return { isHydrated };
}

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
    const [isInitialized, setIsInitialized] = useState(false);

    // Auth selectors
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);
    const accessToken = useSelector(selectAccessToken);
    const hasBasicInfo = useSelector(selectHasBasicInfo);
    const hasAddressInfo = useSelector(selectHasAddressInfo);
    const isEmailVerified = useSelector(selectIsEmailVerified);
    const isPendingVerification = useSelector(selectIsPendingVerification);
    const fcmToken = useSelector(selectFcmToken);

    // Check if user is admin
    const isAdmin = currentUser?.role === 'ADMIN';

    // Initialize auth state from storage (runs only once)
    useEffect(() => {
        const initializeAuth = async () => {
            if (isInitialized) return;

            try {
                const [tokenValue, userValue, fcmTokenValue] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
                    AsyncStorage.getItem(STORAGE_KEYS.USER),
                    AsyncStorage.getItem(STORAGE_KEYS.FCM_TOKEN)
                ]);

                if (tokenValue && userValue) {
                    const user = JSON.parse(userValue);
                    dispatch(hydrate({ token: tokenValue, user, fcmToken: fcmTokenValue }));
                }
            } catch (e) {
                console.error('Failed to initialize auth state:', e);
            } finally {
                setIsInitialized(true);
                setIsReady(true);
            }
        };

        initializeAuth();
    }, [dispatch, isInitialized]);

    // Get latest profile data
    const { data: profileData, error: profileError, refetch: refetchProfile } =
        useGetProfileQuery(undefined, {
            skip: !isAuthenticated || !accessToken || !isInitialized,
            refetchOnMountOrArgChange: true
        });

    // Token refresh hook - with safety checks for non-iterable return
    const refreshTokenResult = useRefreshTokenQuery(undefined, {
        skip: true
    });

    // Safely extract values with fallbacks
    const triggerRefreshToken = refreshTokenResult && typeof refreshTokenResult[0] === 'function'
        ? refreshTokenResult[0]
        : () => Promise.resolve(false);

    const isRefreshing = refreshTokenResult &&
        refreshTokenResult[1] &&
        refreshTokenResult[1].isLoading || false;

    // Handle logout
    const handleLogout = useCallback(async () => {
        // Use the centralized clearCredentials function
        await clearCredentials();

        // Update Redux state
        dispatch(logout());

        // Navigate to login
        navigation.navigate('GuestNav', { screen: 'Login' });
    }, [dispatch, navigation]);

    // Refresh token function
    const refreshToken = useCallback(async () => {
        try {
            // Only call triggerRefreshToken if it's a function
            if (typeof triggerRefreshToken === 'function') {
                const result = await triggerRefreshToken().unwrap();
                return !!result?.token;
            }
            return false;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return false;
        }
    }, [triggerRefreshToken]);

    // Enhanced logging to debug user profile information
    useEffect(() => {
        if (currentUser) {
            logUserProfile(
                currentUser,
                hasBasicInfo,
                hasAddressInfo,
                isEmailVerified,
                isPendingVerification
            );
        }
    }, [currentUser, hasBasicInfo, hasAddressInfo, isEmailVerified, isPendingVerification]);

    // Enhanced validation function that detects profile completion directly from user object
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

        if (isAuthenticated && currentUser) {
            // Check for directly completed profile in the user object
            const userHasCompletedProfile = !!(
                currentUser.info?.first_name &&
                currentUser.info?.last_name &&
                currentUser.info?.contact &&
                currentUser.info?.address &&
                currentUser.info?.city &&
                currentUser.info?.region
            );

            // Check if email is verified directly in the user object
            const userHasVerifiedEmail = !!currentUser.emailVerifiedAt;

            // Only redirect to BasicInformation if required AND not completed based on user data
            if (requireBasicInfo && !hasBasicInfo && !userHasCompletedProfile) {
                navigation.navigate('BasicInformation');
                return false;
            }

            // Only redirect to AddressInformation if required AND basic info is complete but address is not
            if (requireAddressInfo && hasBasicInfo && !hasAddressInfo && !userHasCompletedProfile) {
                navigation.navigate('AddressInformation');
                return false;
            }

            // Only redirect for email verification if it's required AND not verified
            // AND the user hasn't chosen to verify later AND not already verified in user object
            if (requireEmailVerified && !isEmailVerified && !isPendingVerification && !userHasVerifiedEmail) {
                navigation.navigate('EmailVerification');
                return false;
            }
        }

        return true;
    }, [
        isReady,
        isAuthenticated,
        isAdmin,
        currentUser,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isPendingVerification,
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
                    handleLogout();
                }
            });
        }
    }, [profileError, refreshToken, handleLogout, isAuthenticated]);

    return {
        isAuthenticated,
        currentUser,
        accessToken,
        hasBasicInfo,
        hasAddressInfo,
        isEmailVerified,
        isPendingVerification,
        isAdmin,
        isReady,
        fcmToken,
        refreshToken,
        refetchProfile,
        validateRequirements,
        isRefreshing,
        handleLogout,
        userHasCompletedProfile: !!(
            currentUser?.info?.first_name &&
            currentUser?.info?.last_name &&
            currentUser?.info?.contact &&
            currentUser?.info?.address &&
            currentUser?.info?.city &&
            currentUser?.info?.region
        ),
        userHasVerifiedEmail: !!currentUser?.emailVerifiedAt
    };
}
