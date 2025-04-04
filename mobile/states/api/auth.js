import apiSlice from './index';
import { setCredentials, updateOnboardingStatus } from '../slices/auth';
import { persistCredentials } from '../utils/authUtils';
import { resetOnboarding } from '../slices/onboarding';
import { useSelector } from 'react-redux';
import { selectFcmToken } from '../slices/auth';

const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'users/authenticate',
                method: 'POST',
                body: credentials, // Now includes fcmToken
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user, token } = data;
                    const fcmToken = arg.fcmToken || getState().auth.fcmToken;

                    // Store credentials with FCM token
                    await persistCredentials(user, token, fcmToken);

                    // Update Redux state with FCM token
                    dispatch(setCredentials({ userInfo: user, token, fcmToken }));
                } catch (error) {
                    console.error('Login error:', error);
                }
            },
        }),

        register: builder.mutation({
            query: (userData) => ({
                url: 'users',
                method: 'POST',
                body: userData, // Now includes fcmToken
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                try {
                    console.log('Sending registration data:', JSON.stringify(arg, null, 2));
                    const { data } = await queryFulfilled;
                    console.log('Registration successful:', JSON.stringify(data, null, 2));

                    const { user, token } = data;
                    const fcmToken = arg.fcmToken || getState().auth.fcmToken;

                    // Store credentials with FCM token
                    await persistCredentials(user, token, fcmToken);

                    // Update Redux state with FCM token
                    dispatch(setCredentials({ userInfo: user, token, fcmToken }));
                } catch (error) {
                    console.error('Registration error details:', JSON.stringify(error, null, 2));
                }
            },
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/users/logout',
                method: 'POST',
            }),
            invalidatesTags: ['USER'],
        }),

        getProfile: builder.query({
            query: () => 'users/profile',
            providesTags: ['USER'],
        }),

        updateProfile: builder.mutation({
            query: (userData) => {
                // Make sure FormData has the required 'info' field
                if (userData instanceof FormData) {
                    // Check if 'info' field exists
                    const hasInfoField = userData.get('info') !== null;

                    if (!hasInfoField) {
                        console.warn('FormData missing required "info" field');
                    }
                }

                return {
                    url: 'users/profile',
                    method: 'PATCH',
                    body: userData,
                    formData: true
                };
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data } = await queryFulfilled;

                    // Determine which onboarding steps are completed
                    let updatedStatus = {};

                    if (data.user?.info) {
                        const { info } = data.user;

                        // Check if basic info is complete
                        if (info.first_name && info.last_name && info.contact) {
                            updatedStatus.hasBasicInfo = true;
                        }

                        // Check if address info is complete
                        if (info.address && info.city && info.region) {
                            updatedStatus.hasAddressInfo = true;
                        }
                    }

                    // Check if email is verified
                    if (data.user?.emailVerifiedAt) {
                        updatedStatus.isEmailVerified = true;
                    }

                    // Update onboarding status
                    dispatch(updateOnboardingStatus(updatedStatus));

                    // Update stored credentials
                    await persistCredentials(data.user, data.token);
                    dispatch(setCredentials({
                        userInfo: data.user,
                        token: data.token || getState().auth.accessToken
                    }));
                } catch (error) {
                    console.error('Profile update error:', error);
                }
            },
            invalidatesTags: ['USER'],
        }),

        refreshToken: builder.query({
            query: () => 'users/refresh',
        }),

        sendVerificationEmail: builder.mutation({
            query: (userId) => ({
                url: `users/${userId}/send-verify-email`,
                method: 'POST',
                body: { redirectUrl: 'eyezone://verify-email' },
            }),
        }),

        verifyEmail: builder.mutation({
            query: ({ userId, otp }) => ({
                url: `users/${userId}/verify-email`,
                method: 'POST',
                body: { OTP: otp },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Update Redux state to reflect email verification
                    dispatch(updateOnboardingStatus({ isEmailVerified: true }));

                    // Update stored user info with verified email status
                    if (data.user) {
                        await persistCredentials(data.user, data.token || arg.token);
                        dispatch(setCredentials({
                            userInfo: data.user,
                            token: data.token || arg.token
                        }));

                        // Clear onboarding form data while keeping completion status
                        dispatch(resetOnboarding());
                    }
                } catch (error) {
                    console.error('Email verification error:', error);
                }
            },
        }),

        // Update these endpoints for Google auth
        loginWithGoogle: builder.mutation({
            query: (googleData) => ({
                url: '/auth/google/login',
                method: 'POST',
                body: googleData
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user, token, isNewUser } = data;

                    // Store credentials with FCM token
                    await persistCredentials(user, token, arg.fcmToken);

                    // Update Redux state
                    dispatch(setCredentials({
                        userInfo: user,
                        token,
                        fcmToken: arg.fcmToken
                    }));

                    // If this is an existing user, update onboarding status
                    if (!isNewUser) {
                        let updatedStatus = {};

                        if (user?.info) {
                            // Check if basic info is complete
                            if (user.info.first_name && user.info.last_name) {
                                updatedStatus.hasBasicInfo = true;
                            }

                            // Check if address info is complete
                            if (user.info.address && user.info.city) {
                                updatedStatus.hasAddressInfo = true;
                            }
                        }

                        // Check if email is verified (Google emails are auto-verified)
                        if (user?.emailVerifiedAt) {
                            updatedStatus.isEmailVerified = true;
                        }

                        dispatch(updateOnboardingStatus(updatedStatus));
                    }
                } catch (error) {
                    console.error('Google login error:', error);
                }
            },
        }),

        registerWithGoogle: builder.mutation({
            query: (googleData) => ({
                url: '/auth/google/register',
                method: 'POST',
                body: googleData
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user, token, isNewUser } = data;

                    // Store credentials with FCM token
                    await persistCredentials(user, token, arg.fcmToken);

                    // Update Redux state
                    dispatch(setCredentials({
                        userInfo: user,
                        token,
                        fcmToken: arg.fcmToken
                    }));

                    // Set email as verified since Google emails are verified
                    dispatch(updateOnboardingStatus({
                        isEmailVerified: true,
                    }));

                    // For new users, they still need to complete onboarding
                    if (isNewUser) {
                        dispatch(updateOnboardingStatus({
                            hasBasicInfo: false,
                            hasAddressInfo: false,
                        }));
                    }
                } catch (error) {
                    console.error('Google registration error:', error);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useRefreshTokenQuery,
    useSendVerificationEmailMutation,
    useVerifyEmailMutation,
    useLoginWithGoogleMutation,
    useRegisterWithGoogleMutation
} = authApi;

export { authApi };
