import apiSlice from './index';
import { setCredentials, clearCredentials, persistCredentials, updateOnboardingStatus } from '../slices/auth';

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
                    const { data } = await queryFulfilled;
                    const { user, token } = data;

                    // Store credentials securely
                    await persistCredentials(user, token);

                    // Update Redux state
                    dispatch(setCredentials({ userInfo: user, token }));
                } catch (error) {
                    console.error('Registration error:', error);
                }
            },
        }),

        logout: builder.mutation({
            query: () => ({
                url: 'users/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await clearCredentials();
                    dispatch({ type: 'auth/logout' });
                } catch (error) {
                    console.error('Logout error:', error);
                }
            },
        }),

        getProfile: builder.query({
            query: () => 'users/profile',
            providesTags: ['USER'],
        }),

        updateProfile: builder.mutation({
            query: (userData) => ({
                url: 'users/profile',
                method: 'PATCH',
                body: userData,
            }),
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

export default authApi;
