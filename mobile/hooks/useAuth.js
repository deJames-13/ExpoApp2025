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
    logout,
    hydrate
} from '~/states/slices/auth';
import { useGetProfileQuery, useRefreshTokenQuery } from '~/states/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, persistCredentials, clearCredentials } from '~/states/utils/authUtils';

export const useLoadUser = () => {
    const dispatch = useDispatch();
    const [isHydrated, setIsHydrated] = useState(false);

    // Load authentication state from AsyncStorage
    useEffect(() => {
        async function loadAuthState() {
            try {
                const [tokenValue, userValue] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
                    AsyncStorage.getItem(STORAGE_KEYS.USER)
                ]);

                if (tokenValue && userValue) {
                    const user = JSON.parse(userValue);
                    dispatch(hydrate({ token: tokenValue, user }));
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

    // Check if user is admin
    const isAdmin = currentUser?.role === 'ADMIN';

    // Initialize auth state from storage (runs only once)
    useEffect(() => {
        const initializeAuth = async () => {
            if (isInitialized) return;

            try {
                const [tokenValue, userValue] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
                    AsyncStorage.getItem(STORAGE_KEYS.USER)
                ]);

                if (tokenValue && userValue) {
                    const user = JSON.parse(userValue);
                    dispatch(hydrate({ token: tokenValue, user }));
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
        isAdmin,
        isReady,
        refreshToken,
        refetchProfile,
        validateRequirements,
        isRefreshing,
        handleLogout
    };
}
