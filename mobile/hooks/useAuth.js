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
import { STORAGE_KEYS, clearCredentials } from '~/states/utils/authUtils';
import { logUserProfile } from '~/utils/logUtils';

const LOG = false;

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

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);
    const accessToken = useSelector(selectAccessToken);
    const hasBasicInfo = useSelector(selectHasBasicInfo);
    const hasAddressInfo = useSelector(selectHasAddressInfo);
    const isEmailVerified = useSelector(selectIsEmailVerified);
    const isPendingVerification = useSelector(selectIsPendingVerification);
    const fcmToken = useSelector(selectFcmToken);

    const isAdmin = currentUser?.role === 'ADMIN';
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
    const { data: profileData, error: profileError, refetch: refetchProfile } =
        useGetProfileQuery(undefined, {
            skip: !isAuthenticated || !accessToken || !isInitialized,
            refetchOnMountOrArgChange: true
        });
    const refreshTokenResult = useRefreshTokenQuery(undefined, {
        skip: true
    });
    const triggerRefreshToken = refreshTokenResult && typeof refreshTokenResult[0] === 'function'
        ? refreshTokenResult[0]
        : () => Promise.resolve(false);

    const isRefreshing = refreshTokenResult &&
        refreshTokenResult[1] &&
        refreshTokenResult[1].isLoading || false;

    const handleLogout = useCallback(async () => {
        await clearCredentials();
        dispatch(logout());
        navigation.navigate('GuestNav', { screen: 'Login' });
    }, [dispatch, navigation]);

    const refreshToken = useCallback(async () => {
        try {
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

    useEffect(() => {
        if (currentUser) {
            LOG && logUserProfile(
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
            const userHasCompletedProfile = !!(
                currentUser.info?.first_name &&
                currentUser.info?.last_name &&
                currentUser.info?.contact &&
                currentUser.info?.address &&
                currentUser.info?.city &&
                currentUser.info?.region
            );

            const userHasVerifiedEmail = !!currentUser.emailVerifiedAt;
            if (requireBasicInfo && !hasBasicInfo && !userHasCompletedProfile) {
                navigation.navigate('BasicInformation');
                return false;
            }
            if (requireAddressInfo && hasBasicInfo && !hasAddressInfo && !userHasCompletedProfile) {
                navigation.navigate('AddressInformation');
                return false;
            }
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

    useEffect(() => {
        if (!isReady) {
            setIsReady(true);
            return;
        }

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

    useEffect(() => {
        if (isAuthenticated &&
            (profileError?.status === 401 ||
                profileError?.status === 403 ||
                profileError?.status === 419)) {
            refreshToken().then(success => {
                if (!success) {
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
