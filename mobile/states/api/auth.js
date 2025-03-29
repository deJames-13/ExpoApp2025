import apiSlice from './index';
import { setCredentials, updateOnboardingStatus } from '../slices/auth';
import { persistCredentials } from '../utils/authUtils';

const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'users/authenticate',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { user, token } = data;

                    // Store credentials securely
                    await persistCredentials(user, token);

                    // Update Redux state
                    dispatch(setCredentials({ userInfo: user, token }));
                } catch (error) {
                    console.error('Login error:', error);
                }
            },
        }),

        register: builder.mutation({
            query: (userData) => ({
                url: 'users',
                method: 'POST',
                body: userData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    console.log('Sending registration data:', JSON.stringify(arg, null, 2));
                    const { data } = await queryFulfilled;
                    console.log('Registration successful:', JSON.stringify(data, null, 2));

                    const { user, token } = data;

                    // Store credentials securely
                    await persistCredentials(user, token);

                    // Update Redux state
                    dispatch(setCredentials({ userInfo: user, token }));
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
                // Ensure FormData has id field
                if (userData instanceof FormData) {
                    // If we have userData.info, make sure it contains id
                    const infoField = userData.get('info');
                    if (infoField) {
                        try {
                            const parsedInfo = JSON.parse(infoField);
                            // If ID is missing in the info, try to add it
                            if (!parsedInfo.id && parsedInfo._id) {
                                parsedInfo.id = parsedInfo._id;
                                // Replace the info field with updated version
                                userData.delete('info');
                                userData.append('info', JSON.stringify(parsedInfo));
                            }
                        } catch (e) {
                            console.error('Error parsing info field:', e);
                        }
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
                    }
                } catch (error) {
                    console.error('Email verification error:', error);
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
} = authApi;

export { authApi };
