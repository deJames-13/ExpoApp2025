import apiSlice from './index';
import { setNotifications, addNotification, setLoading, setError } from '../slices/notification';

const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get notifications for the current user
        getUserNotifications: builder.query({
            query: () => 'notifications',
            providesTags: ['NOTIFICATIONS'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    dispatch(setLoading(true));
                    const { data } = await queryFulfilled;
                    if (data?.data) {
                        dispatch(setNotifications(data.data));
                    }
                } catch (error) {
                    dispatch(setError(error.message || 'Failed to fetch notifications'));
                } finally {
                    dispatch(setLoading(false));
                }
            }
        }),

        // Register device token for push notifications
        registerDevice: builder.mutation({
            query: (fcmToken) => ({
                url: 'notifications/device',
                method: 'POST',
                body: { fcmToken }
            })
        }),

        // Admin: Send notification to specific users
        sendBatchNotifications: builder.mutation({
            query: (notificationData) => ({
                url: 'notifications/admin/batch',
                method: 'POST',
                body: notificationData
            }),
            invalidatesTags: ['NOTIFICATIONS'],
        }),

        // Admin: Broadcast notification to all users or filtered users
        broadcastNotification: builder.mutation({
            query: (notificationData) => ({
                url: 'notifications/admin/broadcast',
                method: 'POST',
                body: notificationData
            }),
            invalidatesTags: ['NOTIFICATIONS'],
        }),

        // Mark a notification as read
        markNotificationAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `notifications/${notificationId}/read`,
                method: 'PATCH'
            }),
            async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
                // Optimistic update
                dispatch(markAsRead(notificationId));
                try {
                    await queryFulfilled;
                } catch (error) {
                    // Revert on error by refetching
                    dispatch(getUserNotifications.initiate());
                }
            }
        })
    })
});

export const {
    useGetUserNotificationsQuery,
    useRegisterDeviceMutation,
    useSendBatchNotificationsMutation,
    useBroadcastNotificationMutation,
    useMarkNotificationAsReadMutation
} = notificationApi;

export { notificationApi };
